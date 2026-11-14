import katex from 'katex';

interface MathBlockProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export function MathBlock({ latex, displayMode = true, className = '' }: MathBlockProps) {
  let html = '';
  try {
    html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false
    });
  } catch {
    html = latex;
  }

  return (
    <span
      className={displayMode ? `block overflow-x-auto py-1 ${className}` : `inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
