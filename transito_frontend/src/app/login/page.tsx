"use client";

import { useState } from "react";
import LoginService from "../services/login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setCookie } from 'cookies-next';

import OfficerLoading from "./officerLoading/officerLoading";
import Dashboard from "./dashboard/dashboard";

function Login() {
  const [isOfficer, setIsOfficer]: Array<any> = useState(null);
  const [token, setToken]: Array<any> = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
    password: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Required'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: values => {
      LoginUser(values);
    },
  });

  const LoginUser = async (values: Object) => {
    const loginService = new LoginService();
    let data = await loginService.post(values);
    if (data.error) {
      formik.setValues({ username: "", password: "" });
    } else {
      setCookie("token", data.response.access, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: true,
      });
      setCookie("refresh", data.response.refresh, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: true,
      });
      console.log(data)
      setIsOfficer(data.response.is_officer);
      setToken(true);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {!token && (

          <form onSubmit={formik.handleSubmit} className="col-4 text-start">
            <h1 className="mb-4">Login</h1>
            <input
              name="username"
              style={{ width: "100%" }} className="mb-3"
              type="text" placeholder="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {
              formik.touched.username && formik.errors.username ? (
                <div>{formik.errors.username}</div>
              ) : null
            }
            <br />
            <input
              name="password"
              style={{ width: "100%" }} type="password"
              placeholder="password" autoComplete=""
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {
              formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null
            }
            <div className="container mt-5">
              <div className="row text-center">
                <div className="col-6">
                  <Link href="/">cancel</Link>
                </div>
                <div className="col-6">
                  <button type="submit">Login</button>
                </div>
              </div>
            </div>
          </form>
        )
        }
        {
          token && isOfficer && <OfficerLoading />
        }
        {
          token && !isOfficer && <Dashboard />
        }
      </div>
    </div>
  );
}

export default Login;
