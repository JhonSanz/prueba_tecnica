interface ConfirmationProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function Confirmation({
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmationProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="d-flex">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  )
}

export default Confirmation;
