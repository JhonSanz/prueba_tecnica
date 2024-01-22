"use client";

import { useState } from "react";
import Link from 'next/link';
import Table from "@/components/table";
import InfractionsSummaryService from "@/app/services/summary";


export default function Home() {
  const [data, setData] = useState<Array<any>>([]);
  const [email, setEmail] = useState("");
  const columns = [
    { name: "id", field: "id" },
    { name: "oficial", field: "officer.name" },
    { name: "Fecha", field: "created_at" },
    { name: "Vehiculo", field: "vehicle.license_plate" },
    { name: "Comentarios", field: "comments" },
  ]

  async function getPositionsData(filters: object): Promise<any> {
    const positionService = new InfractionsSummaryService();
    const data = await positionService.get(filters, "", false);
    if (!data.error) setData(data.response.data);
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <Link href="/login">Login</Link>
          <br /><br />
          <p>Busca aquí tus infracciones escribiendo el correo electrónico. ejemplo: p1@mail.com</p>
          <input
            name="email"
            className="mb-3"
            type="text" placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => getPositionsData({ email: email })}>Buscar</button>
          <Table columns={columns} rows={data} />
        </div>
      </div>
    </div>
  );
}
