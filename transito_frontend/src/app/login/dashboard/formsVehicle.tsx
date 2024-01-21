import React, { useState, useRef } from 'react';
import DynamicForm from '@/components/dynamicForm';
import InfoMessage from '@/components/infoMessage';
import VehicleService from "@/app/services/vehicle";
import ErrorsFormatting from '@/components/errorsFormatting';
import * as Yup from 'yup';
import Confirmation from "@/components/confirmation";


interface CreateVehicleFormProps {
  brands: Array<any>;
  setIsModalOpen: (e: boolean) => void;
  // updateInterface: () => void;
}

function CreateVehicleForm({
  brands,
  setIsModalOpen,
  // updateInterface,
}: CreateVehicleFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  const handleSubmitForm = async (bodyValues: any) => {
    const positionService = new VehicleService();
    const data = await positionService.post(bodyValues);
    if (data.error) {
      setErrorMessage(<ErrorsFormatting errors={data.response} />);
    } else {
      setIsModalOpen(false);
      // updateInterface();
    }
  }

  const fields = [
    {
      "alias": "Marca",
      "name": "brand", "type": "choices",
      "default": brands.length > 0 ? brands[0].id : "",
      "validators": Yup.string(),
      "choices": brands.map((brand: any) => { return { value: brand.id, name: brand.name } })
    },
    {
      "alias": "Placa",
      "name": "license_plate",
      "type": "string",
      "default": "",
      "validators": Yup.string().max(6).required("required")
    },
    {
      "alias": "Color",
      "name": "color",
      "type": "string",
      "default": "",
      "validators": Yup.string().required("required")
    },
    // {
    //   "alias": "brand",
    //   "name": "Marca", "type": "choices",
    //   "default": brands.length > 0 ? brands[0].id : "",
    //   "validators": Yup.string(),
    //   "choices": brands.map((brand: any) => { return { value: brand.id, name: brand.name } })
    // }
  ]
  return (
    <div>
      <h3>Create Vehicle</h3>
      <DynamicForm ref={ref} fields={fields} submitFunction={handleSubmitForm} />
      <br />
      <InfoMessage error={errorMessage} />
      <button type='submit' onClick={() => triggerSubmit()}>Create</button>
    </div>
  )
}

export default CreateVehicleForm;


interface UpdateVehicleFormProps {
  brands: Array<any>;
  setIsModalOpen: (e: boolean) => void;
  currentRow: any;
  // updateInterface: () => void;
}

function UpdateVehicleForm({
  brands,
  setIsModalOpen,
  currentRow,
  // updateInterface,
}: UpdateVehicleFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  const handleSubmitForm = async (bodyValues: any) => {
    const positionService = new VehicleService();
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
      "alias": "Marca",
      "name": "brand", "type": "choices",
      "default": currentRow.brand.id,
      "validators": Yup.string(),
      "choices": brands.map((brand: any) => { return { value: brand.id, name: brand.name } })
    },
    {
      "alias": "Placa",
      "name": "license_plate",
      "type": "string",
      "default": currentRow.license_plate,
      "validators": Yup.string().max(6).required("required")
    },
    {
      "alias": "Color",
      "name": "color",
      "type": "string",
      "default": currentRow.color,
      "validators": Yup.string().required("required")
    },
    // {
    //   "alias": "brand",
    //   "name": "Marca", "type": "choices",
    //   "default": brands.length > 0 ? brands[0].id : "",
    //   "validators": Yup.string(),
    //   "choices": brands.map((brand: any) => { return { value: brand.id, name: brand.name } })
    // }
  ]

  return (
    <div>
      <h3>Update Vehicle</h3>
      <DynamicForm ref={ref} fields={fields} submitFunction={handleSubmitForm} />
      <br />
      <InfoMessage error={errorMessage} />
      <button type='submit' onClick={() => triggerSubmit()}>Update</button>
    </div>
  )
}

export { UpdateVehicleForm };


export function vehicleForms(action: string, row: any, setIsModalOpen: any, brands: any) {
  switch (action) {
    case "pencil":
      return <UpdateVehicleForm
        brands={brands}
        currentRow={row}
        setIsModalOpen={setIsModalOpen}
      // updateInterface={updateInterface}
      />
    case "trash3":
      return <Confirmation
        title="Delete position"
        description="Are you sure you want to delete this vehicle?"
        onConfirm={() => /*deletePosition(row.id)*/ console.log("world")} onCancel={() => setIsModalOpen(false)}
      />
    default:
      return;
  }
}