"use client";

import { useState, useEffect } from "react";
import Table from "@/components/table";
import InfractionService from "@/app/services/infraction";
import VehicleService from "@/app/services/vehicle";
import PersonService from "@/app/services/person";
import OfficerService from "@/app/services/officer";

function Dashboard() {

  const [isAdmin, setIsAdmin] = useState(false);

  const [data, setData] = useState([]);
  const [columns, setColumns]: Array<any> = useState([]);

  const [option, setOption] = useState("person");
  const allTables = ["person", "vehicle", "infraction", "officer"];

  const columnsVehicle = [
    { name: "Marca", field: "brand.name" },
    { name: "Placa", field: "license_plate" },
    { name: "Color", field: "color" },
    { name: "Infractor", field: "infractor.name" },
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

  useEffect(() => {
    async function fetchData() {
      let data;
      switch (option) {
        case "person":
          data = await getPositionsData(PersonService);
          setColumns(columnsPerson);
          break;
        case "vehicle":
          data = await getPositionsData(VehicleService);
          setColumns(columnsVehicle);
          break;
        case "infraction":
          data = await getPositionsData(InfractionService);
          setColumns(columnsInfraction);
          break;
        case "officer":
          data = await getPositionsData(OfficerService);
          setColumns(columnsOfficer);
          break;
        default:
          data = [];
          break;
      }
      console.log("option", option, data.data)
      setData(data.data)
    }
    fetchData();
  }, [option]);

  return (
    <div>
      <h1>Hello :D {option}</h1>

      <select className="form-select" onChange={(e) => setOption(e.target.value)}>
        {
          allTables.map(item => <option key={item} value={item}>{item}</option>)
        }
      </select>

      <br />
      <Table columns={columns} rows={data} /*rowOptions={positionsOptionsMain}*/ />

    </div>
  );
}

export default Dashboard;
