import "@/styles/infoMessage.css"

interface InfoMessageProps {
  error: React.ReactNode;
}

function InfoMessage({
  error
}: InfoMessageProps) {
  return (
    <>
      {
        error && (
          <div className="error">
            {error}
          </div>
        )
      }
    </>
  )
}

export default InfoMessage;
