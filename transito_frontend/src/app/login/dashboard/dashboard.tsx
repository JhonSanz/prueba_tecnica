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

  const [isAdmin, setIsAdmin] = useState(false);

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

  async function getPositionsData(service: any): Promise<any> {
    const positionService = new service();
    const data = await positionService.get();
    if (data.error) return { data: [] };
    return data.response;
  }

  const BRANDS = [{ id: 1, name: "yamaha" }, { id: 2, name: "other" }];

  useEffect(() => {
    async function fetchData() {
      let data;
      switch (option) {
        case "person":
          data = await getPositionsData(PersonService);
          setColumns(columnsPerson);
          setModalOption(
            <CreatePersonForm
              setIsModalOpen={setIsModalOpen}
            // updateInterface={updateInterface}
            />
          );
          break;
        case "vehicle":
          data = await getPositionsData(VehicleService);
          setColumns(columnsVehicle);
          setModalOption(
            <CreateVehicleForm
              brands={BRANDS}
              setIsModalOpen={setIsModalOpen}
            // updateInterface={updateInterface}
            />
          );
          break;
        case "infraction":
          data = await getPositionsData(InfractionService);
          setColumns(columnsInfraction);
          break;
        case "officer":
          data = await getPositionsData(OfficerService);
          setColumns(columnsOfficer);
          setModalOption(
            <CreateOfficerForm
              setIsModalOpen={setIsModalOpen}
            // updateInterface={updateInterface}
            />
          );
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
        formOption = personForms(action, row, setIsModalOpen);
        break;
      case "vehicle":
        formOption = vehicleForms(action, row, setIsModalOpen, BRANDS);
        break;
      case "infraction":
        formOption = personForms(action, row, setIsModalOpen);
        break;
      case "officer":
        formOption = officerForms(action, row, setIsModalOpen);
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