"use client";

import LoginService from "../services/login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setCookie } from 'cookies-next';

function Login() {
  const router = useRouter();

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
      router.push("/redirect");
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
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
      </div>
    </div>
  );
}

export default Login;
