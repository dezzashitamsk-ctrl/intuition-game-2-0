import { PredictionMode } from '../types/game';

const INITIAL_CHIPS = 1000;
const ROUND_BET = 100;

// Выигрыши за разные типы предсказаний (фиксированные значения)
const WINNINGS = {
    color: 50,    // За угадывание цвета
    suit: 100,    // За угадывание масти
    rank: 400,    // За угадывание достоинства
    full: 'pot'   // За полное совпадение - весь банк
} as const;

type ChipsTransaction = {
    playerId: number;
    amount: number;
    type: 'bet' | 'win';
    timestamp: number;
};

export class ChipsService {
    private playerChips: Map<number, number>;
    private pot: number;
    private transactions: ChipsTransaction[];

    constructor(playerIds: number[]) {
        this.playerChips = new Map(
            playerIds.map(id => [id, INITIAL_CHIPS])
        );
        this.pot = 0;
        this.transactions = [];
        console.log('ChipsService initialized:', {
            playerChips: Object.fromEntries(this.playerChips),
            pot: this.pot
        });
    }

    private addTransaction(playerId: number, amount: number, type: 'bet' | 'win') {
        const transaction = {
            playerId,
            amount,
            type,
            timestamp: Date.now()
        };
        this.transactions.push(transaction);
        console.log(`New transaction:`, transaction);
    }

    public collectBets(playerIds: number[]): ChipsTransaction[] {
        const transactions: ChipsTransaction[] = [];
        console.log('Collecting bets from players:', playerIds);
        console.log('Current pot before bets:', this.pot);

        playerIds.forEach(playerId => {
            const currentChips = this.playerChips.get(playerId) || 0;
            if (currentChips >= ROUND_BET) {
                // Списываем ставку
                const newBalance = currentChips - ROUND_BET;
                this.playerChips.set(playerId, newBalance);
                this.pot += ROUND_BET;

                const transaction = {
                    playerId,
                    amount: ROUND_BET,
                    type: 'bet' as const,
                    timestamp: Date.now()
                };

                transactions.push(transaction);
                this.transactions.push(transaction);
                console.log(`Player ${playerId} bet ${ROUND_BET} chips. New balance: ${newBalance}`);
            } else {
                console.log(`Player ${playerId} doesn't have enough chips to bet`);
            }
        });

        console.log('Current pot after bets:', this.pot);
        return transactions;
    }

    public processWin(playerId: number, predictionMode: PredictionMode): number {
        console.log(`Processing win for player ${playerId}:`, {
            mode: predictionMode,
            currentPot: this.pot,
            currentChips: this.playerChips.get(playerId)
        });

        // Проверка на null
        if (!predictionMode) {
            console.log(`Invalid prediction mode for player ${playerId}`);
            return 0;
        }

        // Определяем сумму выигрыша
        let winAmount: number;
        if (predictionMode === 'full') {
            // За полное совпадение - весь банк
            winAmount = this.pot;
            console.log(`Full match - taking entire pot: ${winAmount}`);
        } else {
            // За остальные типы - фиксированная сумма
            const baseWin = WINNINGS[predictionMode] as number;
            winAmount = Math.min(baseWin, this.pot);
            console.log(`Fixed win for ${predictionMode}: ${winAmount} (base: ${baseWin}, pot limit: ${this.pot})`);
        }

        if (winAmount > 0) {
            const currentChips = this.playerChips.get(playerId) || 0;
            const newBalance = currentChips + winAmount;

            // Начисляем выигрыш
            this.playerChips.set(playerId, newBalance);
            // Уменьшаем банк
            this.pot -= winAmount;

            // Записываем транзакцию
            this.addTransaction(playerId, winAmount, 'win');

            console.log(`Win processed for player ${playerId}:`, {
                previousBalance: currentChips,
                winAmount,
                newBalance,
                remainingPot: this.pot
            });
        } else {
            console.log(`No win for player ${playerId} - pot is empty`);
        }

        return winAmount;
    }

    public getPlayerChips(playerId: number): number {
        return this.playerChips.get(playerId) || 0;
    }

    public getPot(): number {
        return this.pot;
    }

    public canMakeBet(playerId: number): boolean {
        return (this.playerChips.get(playerId) || 0) >= ROUND_BET;
    }

    public getTransactions(): ChipsTransaction[] {
        return [...this.transactions];
    }
} 