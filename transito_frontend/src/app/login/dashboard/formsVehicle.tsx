import React, { useState, useEffect, useRef } from 'react';
import DynamicForm from '@/components/dynamicForm';
import InfoMessage from '@/components/infoMessage';
import VehicleService from "@/app/services/vehicle";
import PersonService from "@/app/services/person";
import ErrorsFormatting from '@/components/errorsFormatting';
import * as Yup from 'yup';
import Confirmation from "@/components/confirmation";
import BrandService from '@/app/services/brand';


interface CreateVehicleFormProps {
  setIsModalOpen: (e: boolean) => void;
  updateInterface: () => void;
}

function CreateVehicleForm({
  setIsModalOpen,
  updateInterface,
}: CreateVehicleFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const [brands, setBrands] = useState<Array<any>>([]);
  const [person, setPerson] = useState<Array<any>>([]);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  async function getBrandData(): Promise<any> {
    const brandService = new BrandService();
    const data = await brandService.get();
    if (data.error) return { data: [] };
    return data.response;
  }

  async function getPersonData(): Promise<any> {
    const personService = new PersonService();
    const data = await personService.get();
    if (data.error) return { data: [] };
    return data.response;
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getBrandData();
      const responsePerson = await getPersonData();
      setBrands(response.data);
      setPerson(responsePerson.data);
    }
    fetchData();
  }, []);

  const handleSubmitForm = async (bodyValues: any) => {
    const positionService = new VehicleService();
    const data = await positionService.post(bodyValues);
    if (data.error) {
      setErrorMessage(<ErrorsFormatting errors={data.response} />);
    } else {
      setIsModalOpen(false);
      updateInterface();
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
    {
      "alias": "Dueño",
      "name": "infractor", "type": "choices",
      "default": person.length > 0 ? person[0].id : "",
      "validators": Yup.string(),
      "choices": person.map((p: any) => { return { value: p.id, name: p.name } })
    }
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
  setIsModalOpen: (e: boolean) => void;
  currentRow: any;
  updateInterface: () => void;
}

function UpdateVehicleForm({
  setIsModalOpen,
  currentRow,
  updateInterface,
}: UpdateVehicleFormProps) {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const [brands, setBrands] = useState<Array<any>>([]);
  const [person, setPerson] = useState<Array<any>>([]);
  const ref = useRef<HTMLFormElement>(null);

  const triggerSubmit = () => {
    if (!ref || !ref.current) return;
    if (!ref.current.isValid()) return;
    ref.current.submit();
  }

  async function getBrandData(): Promise<any> {
    const brandService = new BrandService();
    const data = await brandService.get();
    if (data.error) return { data: [] };
    return data.response;
  }

  async function getPersonData(): Promise<any> {
    const personService = new PersonService();
    const data = await personService.get();
    if (data.error) return { data: [] };
    return data.response;
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getBrandData();
      const responsePerson = await getPersonData();
      setBrands(response.data);
      setPerson(responsePerson.data);
    }
    fetchData();
  }, []);


  const handleSubmitForm = async (bodyValues: any) => {
    const positionService = new VehicleService();
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
    {
      "alias": "Dueño",
      "name": "infractor", "type": "choices",
      "default": currentRow.infractor.id,
      "validators": Yup.string(),
      "choices": person.map((p: any) => { return { value: p.id, name: p.name } })
    }
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


export function vehicleForms(action: string, row: any, setIsModalOpen: any, updateInterface: any) {
  async function deleteVehicle(id: string) {
    const service = new VehicleService();
    await service.del(id);
    updateInterface();
    setIsModalOpen(false);
  }

  switch (action) {
    case "pencil":
      return <UpdateVehicleForm
        currentRow={row}
        setIsModalOpen={setIsModalOpen}
        updateInterface={updateInterface}
      />
    case "trash3":
      return <Confirmation
        title="Delete vehicle"
        description="Are you sure you want to delete this vehicle?"
        onConfirm={() => deleteVehicle(row.id)} onCancel={() => setIsModalOpen(false)}
      />
    default:
      return;
  }
}