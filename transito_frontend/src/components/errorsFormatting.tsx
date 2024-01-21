interface ErrorsFormattingProps {
  errors: Record<string, Array<string>>;
}

function ErrorsFormatting({ errors }: ErrorsFormattingProps) {
  return (
    <ul>
      {Object.entries(errors).map(([key, value]: [string, Array<string>]) => {
        return (
          <li key={key}>
            {key}: {value.join(", ")}
          </li>
        );
      })}
    </ul>
  );
}

export default ErrorsFormatting;
