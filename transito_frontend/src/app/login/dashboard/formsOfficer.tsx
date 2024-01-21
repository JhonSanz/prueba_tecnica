import React, { useState, useRef } from 'react';
import DynamicForm from '@/components/dynamicForm';
import InfoMessage from '@/components/infoMessage';
import OfficerService from "@/app/services/officer";
import ErrorsFormatting from '@/components/errorsFormatting';
import * as Yup from 'yup';
import Confirmation from "@/components/confirmation";


interface CreateOfficerFormProps {
  setIsModalOpen: (e: boolean) => void;
  // updateInterface: () => void;
}

function CreateOfficerForm({
  setIsModalOpen,
  // updateInterface,
}: CreateOfficerFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  const handleSubmitForm = async (bodyValues: any) => {
    const bodyCopy = { ...bodyValues, direction: "1" }
    const positionService = new OfficerService();
    const data = await positionService.post(bodyCopy);
    if (data.error) {
      setErrorMessage(<ErrorsFormatting errors={data.response} />);
    } else {
      setIsModalOpen(false);
      // updateInterface();
    }
  }

  const fields = [
    {
      "alias": "Nombre",
      "name": "name",
      "type": "string",
      "default": "",
      "validators": Yup.string().required("required")
    },
    {
      "alias": "Identificación",
      "name": "identification",
      "type": "string",
      "default": "",
      "validators": Yup.string().required("required")
    },
  ]
  return (
    <div>
      <h3>Create Officer</h3>
      <DynamicForm ref={ref} fields={fields} submitFunction={handleSubmitForm} />
      <br />
      <InfoMessage error={errorMessage} />
      <button type='submit' onClick={() => triggerSubmit()}>Create</button>
    </div>
  )
}

export default CreateOfficerForm;


interface UpdateOfficerFormProps {
  setIsModalOpen: (e: boolean) => void;
  currentRow: any;
  // updateInterface: () => void;
}

function UpdateOfficerForm({
  setIsModalOpen,
  currentRow,
  // updateInterface,
}: UpdateOfficerFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  const handleSubmitForm = async (bodyValues: any) => {
    const positionService = new OfficerService();
    const data = await positionService.put(currentRow.id, bodyValues);
    if (data.error) {
      setErrorMessage(<ErrorsFormatting errors={data.response} />);
    } else {
      setIsModalOpen(false);
      // updateInterface();
    }
  }

  const fields = [
    {
      "alias": "Nombre",
      "name": "name",
      "type": "string",
      "default": currentRow.name,
      "validators": Yup.string().required("required")
    },
    {
      "alias": "Identificación",
      "name": "identification",
      "type": "string",
      "default": currentRow.identification,
      "validators": Yup.string().required("required")
    },
  ]
  return (
    <div>
      <h3>Update Officer</h3>
      <DynamicForm ref={ref} fields={fields} submitFunction={handleSubmitForm} />
      <br />
      <InfoMessage error={errorMessage} />
      <button type='submit' onClick={() => triggerSubmit()}>Update</button>
    </div>
  )
}

export { UpdateOfficerForm };


export function officerForms(action: string, row: any, setIsModalOpen: any) {
  switch (action) {
    case "pencil":
      return <UpdateOfficerForm
        currentRow={row}
        setIsModalOpen={setIsModalOpen}
      // updateInterface={updateInterface}
      />
    case "trash3":
      return <Confirmation
        title="Delete position"
        description="Are you sure you want to delete this officer?"
        onConfirm={() => /*deletePosition(row.id)*/ console.log("world")} onCancel={() => setIsModalOpen(false)}
      />
    default:
      return;
  }
}