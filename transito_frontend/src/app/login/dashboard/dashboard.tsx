"use client";

import { useState, useEffect } from "react";
import Table from "@/components/table";
import InfractionService from "@/app/services/infraction";
import VehicleService from "@/app/services/vehicle";
import PersonService from "@/app/services/person";
import OfficerService from "@/app/services/officer";
import positionsOptions from "@/components/tableRowOptions";
import Modal from '@/components/modal';

import CreatePersonForm, { personForms } from "./formsPerson";
import CreateVehicleForm, { vehicleForms } from "./formsVehicle";
import CreateOfficerForm, { officerForms } from "./formsOfficer";


function Dashboard() {

  const [data, setData] = useState([]);
  const [columns, setColumns]: Array<any> = useState([]);

  const [option, setOption] = useState("person");
  const allTables = ["person", "vehicle", "officer"];

  const columnsVehicle = [
    { name: "Marca", field: "brand.name" },
    { name: "Placa", field: "license_plate" },
    { name: "Color", field: "color" },
    { name: "Dueño", field: "infractor.name" },
  ]

  const columnsPerson = [
    { name: "Nombre", field: "name" },
    { name: "Email", field: "email" },
  ]

  const columnsInfraction = [
    { name: "oficial", field: "officer.name" },
    { name: "Fecha", field: "created_at" },
    { name: "Vehiculo", field: "vehicle.license_plate" },
    { name: "Comentarios", field: "comments" },
  ]

  const columnsOfficer = [
    { name: "Oficial", field: "name" },
    { name: "Identificación", field: "identification" }
  ]

  async function getData(service: any): Promise<any> {
    const serviceInstance = new service();
    const data = await serviceInstance.get();
    if (data.error) return { data: [] };
    return data.response;
  }

  async function updateInterface(service: any): Promise<any> {
    const serviceInstance = new service();
    const data = await serviceInstance.get();
    if (!data.error) setData(data.response.data)
  }

  function getCreateForm() {
    switch (option) {
      case "person":
        return <CreatePersonForm
          setIsModalOpen={setIsModalOpen}
          updateInterface={() => updateInterface(PersonService)}
        />
      case "vehicle":
        return <CreateVehicleForm
          setIsModalOpen={setIsModalOpen}
          updateInterface={() => updateInterface(VehicleService)}
        />
      case "officer":
        return <CreateOfficerForm
          setIsModalOpen={setIsModalOpen}
          updateInterface={() => updateInterface(OfficerService)}
        />
      default:
        break;
    }
  }

  useEffect(() => {
    async function fetchData() {
      let data;
      switch (option) {
        case "person":
          data = await getData(PersonService);
          setColumns(columnsPerson);
          setModalOption(getCreateForm());
          break;
        case "vehicle":
          data = await getData(VehicleService);
          setColumns(columnsVehicle);
          setModalOption(getCreateForm());
          break;
        case "officer":
          data = await getData(OfficerService);
          setColumns(columnsOfficer);
          setModalOption(getCreateForm());
          break;
        default:
          data = [];
          break;
      }
      setData(data.data)
    }
    fetchData();
  }, [option]);


  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalOption, setModalOption] = useState<any>(null);

  const rowOptions = [
    { icon: "pencil" },
    { icon: "trash3" },
  ]
  const performAction = (action: string, row: any) => {
    let formOption = null;

    switch (option) {
      case "person":
        formOption = personForms(action, row, setIsModalOpen, () => updateInterface(PersonService));
        break;
      case "vehicle":
        formOption = vehicleForms(action, row, setIsModalOpen, () => updateInterface(VehicleService));
        break;
      case "officer":
        formOption = officerForms(action, row, setIsModalOpen, () => updateInterface(OfficerService));
        break;
      default:
        break;
    }
    if (formOption === null) return;
    setModalOption(formOption);
    setIsModalOpen(true);
  }

  const positionsOptionsMain = (row: any) => positionsOptions(row, rowOptions, performAction)

  return (
    <div>
      <h1>Hello :D</h1>

      <select className="form-select" onChange={(e) => setOption(e.target.value)}>
        {
          allTables.map(item => <option key={item} value={item}>{item}</option>)
        }
      </select>

      <br />
      <button
        onClick={() => {
          setModalOption(getCreateForm());
          setIsModalOpen(true);
        }}
      >
        <i className="bi bi-plus-lg"></i>
      </button>
      <br />
      <Table columns={columns} rows={data} rowOptions={positionsOptionsMain} />
      <Modal
        isOpen={isModalOpen} setIsOpen={setIsModalOpen}
        children={modalOption}
      />
    </div>
  );
}

export default Dashboard;
