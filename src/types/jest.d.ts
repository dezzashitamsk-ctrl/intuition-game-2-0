import '@testing-library/jest-dom';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeDisabled(): R;
            toBeEnabled(): R;
            toBeEmpty(): R;
            toBeInTheDocument(): R;
            toBeInvalid(): R;
            toBeRequired(): R;
            toBeValid(): R;
            toBeVisible(): R;
            toContainElement(element: Element | null): R;
            toContainHTML(html: string): R;
            toHaveAttribute(attr: string, value?: string): R;
            toHaveClass(...classNames: string[]): R;
            toHaveFocus(): R;
            toHaveFormValues(values: { [key: string]: any }): R;
            toHaveStyle(css: string | object): R;
            toHaveTextContent(text: string | RegExp): R;
            toHaveValue(value?: string | string[] | number): R;
            toBeChecked(): R;
            toBePartiallyChecked(): R;
            toHaveDescription(text?: string | RegExp): R;
        }
    }
} 