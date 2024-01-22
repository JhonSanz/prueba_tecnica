"use client";

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UploadInfractionService from "@/app/services/uploadInfraction";
import ErrorsFormatting from '@/components/errorsFormatting';

function OfficerLoading() {
  const validationSchema = Yup.object({
    placa_patente: Yup.string()
      .max(6)
      .min(6)
      .required('Required'),
    timestamp: Yup.string().required('Required'),
    comentarios: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      placa_patente: '',
      timestamp: '',
      comentarios: '',
    },
    validationSchema,
    onSubmit: values => {
      CreateInfraction(values);
    },
  });
  const [serverErrors, setServerErrors] = useState(null);


  const CreateInfraction = async (bodyValues: Object) => {
    const positionService = new UploadInfractionService();
    const data = await positionService.post(bodyValues);
    if (data.error) {
      formik.setValues({ placa_patente: "", timestamp: "", comentarios: "" });
      setServerErrors(data.response);
    } else {
      alert("done");
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <form onSubmit={formik.handleSubmit} className="col-8 text-start">
          <h1 className="mb-4">UPLOAD INFRACTION</h1>
          <input
            name="placa_patente"
            style={{ width: "100%" }} className="mb-3"
            type="text" placeholder="placa_patente"
            onChange={formik.handleChange}
            value={formik.values.placa_patente}
          />
          {
            formik.touched.placa_patente && formik.errors.placa_patente ? (
              <div>{formik.errors.placa_patente}</div>
            ) : null
          }
          <br />
          <small>Para este campo el formato es YYYY-MM-DDTHH:MM</small>
          <input
            name="timestamp"
            style={{ width: "100%" }} type="timestamp" className="mb-3"
            placeholder="timestamp" autoComplete=""
            onChange={formik.handleChange}
            value={formik.values.timestamp}
          />
          {
            formik.touched.timestamp && formik.errors.timestamp ? (
              <div>{formik.errors.timestamp}</div>
            ) : null
          }
          <br />
          <input
            name="comentarios"
            style={{ width: "100%" }} type="comentarios"
            placeholder="comentarios" autoComplete=""
            onChange={formik.handleChange}
            value={formik.values.comentarios}
          />
          {
            formik.touched.comentarios && formik.errors.comentarios ? (
              <div>{formik.errors.comentarios}</div>
            ) : null
          }
          <div className="container mt-5">
            <div className="row text-center">
              <div className="col-12">
                <button type="submit">Upload</button>
              </div>
            </div>
          </div>
        </form>
        {serverErrors && (
          <ErrorsFormatting errors={serverErrors} />
        )}
      </div>
    </div>
  );
}

export default OfficerLoading;
