import React, { useState, useRef } from 'react';
import DynamicForm from '@/components/dynamicForm';
import InfoMessage from '@/components/infoMessage';
import PersonService from "@/app/services/person";
import ErrorsFormatting from '@/components/errorsFormatting';
import * as Yup from 'yup';
import Confirmation from "@/components/confirmation";


interface CreatePersonFormProps {
  setIsModalOpen: (e: boolean) => void;
  updateInterface: () => void;
}

function CreatePersonForm({
  setIsModalOpen,
  updateInterface,
}: CreatePersonFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  const handleSubmitForm = async (bodyValues: any) => {
    const bodyCopy = { ...bodyValues, direction: "1" }
    const positionService = new PersonService();
    const data = await positionService.post(bodyCopy);
    if (data.error) {
      setErrorMessage(<ErrorsFormatting errors={data.response} />);
    } else {
      setIsModalOpen(false);
      updateInterface();
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
      "alias": "Email",
      "name": "email",
      "type": "email",
      "default": "",
      "validators": Yup.string().required("required")
    },
  ]
  return (
    <div>
      <h3>Create Person</h3>
      <DynamicForm ref={ref} fields={fields} submitFunction={handleSubmitForm} />
      <br />
      <InfoMessage error={errorMessage} />
      <button type='submit' onClick={() => triggerSubmit()}>Create</button>
    </div>
  )
}

export default CreatePersonForm;


interface UpdatePersonFormProps {
  setIsModalOpen: (e: boolean) => void;
  currentRow: any;
  updateInterface: () => void;
}

function UpdatePersonForm({
  setIsModalOpen,
  currentRow,
  updateInterface,
}: UpdatePersonFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  const handleSubmitForm = async (bodyValues: any) => {
    const positionService = new PersonService();
    const data = await positionService.put(currentRow.id, bodyValues);
    if (data.error) {
      setErrorMessage(<ErrorsFormatting errors={data.response} />);
    } else {
      setIsModalOpen(false);
      updateInterface();
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
      "alias": "Email",
      "name": "email",
      "type": "email",
      "default": currentRow.email,
      "validators": Yup.string().required("required")
    }
  ]
  return (
    <div>
      <h3>Update Person</h3>
      <DynamicForm ref={ref} fields={fields} submitFunction={handleSubmitForm} />
      <br />
      <InfoMessage error={errorMessage} />
      <button type='submit' onClick={() => triggerSubmit()}>Update</button>
    </div>
  )
}

export { UpdatePersonForm };


export function personForms(action: string, row: any, setIsModalOpen: any, updateInterface: any) {

  async function deletePerson(id: string) {
    const service = new PersonService();
    await service.del(id);
    updateInterface();
    setIsModalOpen(false);
  }

  switch (action) {
    case "pencil":
      return <UpdatePersonForm
        currentRow={row}
        setIsModalOpen={setIsModalOpen}
        updateInterface={updateInterface}
      />
    case "trash3":
      return <Confirmation
        title="Delete person"
        description="Are you sure you want to delete this person?"
        onConfirm={() => deletePerson(row.id)} onCancel={() => setIsModalOpen(false)}
      />
    default:
      return;
  }
}