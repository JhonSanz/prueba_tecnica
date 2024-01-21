import { forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css'

type FormType = {
  name: string;
  type: string;
  default: any;
  choices?: any;
  validators: any;
  disabled?: boolean;
}

interface DynamicFormProps {
  fields: Array<FormType>;
  submitFunction: (data: any) => void;
  width?: string;
}


const DynamicForm = forwardRef(function DynamicForm({
  fields,
  submitFunction,
  width
}: DynamicFormProps, ref) {

  const validationSchema = Yup.object({
    ...Object.fromEntries(
      fields.map((val) => [val.name, val.validators])
    )
  })

  const initialValues = Object.fromEntries(
    fields.map((val) => [val.name, val.default])
  )

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: values => {
      submitFunction(values);
    },
  });

  useImperativeHandle(ref, () => {
    return {
      submit(): void {
        formik.handleSubmit();
      },
      isValid(): boolean {
        return formik.isValid;
      }
    };
  }, []);

  return (
    <div className='pt-2 pb-2'>
      <div className="row">
        {
          fields.map((item: any) => {
            return (
              <div className={width || 'col-sm-6 col-md-3'} key={item.name}>
                <div><small>{item.alias}</small></div>
                {
                  item.type === "choices" && (
                    <select
                      name={item.name} id={item.name}
                      onChange={formik.handleChange}
                      value={formik.values[item.name]}
                      style={{ width: "100%" }}
                      disabled={item.disabled}
                    >
                      {
                        item.choices.map((choice: any) => {
                          return (
                            <option key={choice.name} value={choice.value}>{choice.name}</option>
                          )
                        })
                      }
                    </select>
                  )
                }
                {
                  item.type === "boolean" && (
                    <input
                      name={item.name}
                      id={item.name}
                      type="checkbox"
                      onChange={formik.handleChange}
                      value={formik.values[item.name]}
                      disabled={item.disabled}
                    />
                  )
                }
                {/* {
                  item.type === "date" && (
                    <DatePicker
                      timeInputLabel="Time:"
                      dateFormat="yyyy-MM-dd h:mm aa"
                      showTimeInput
                      name={item.name}
                      selected={(formik.values[item.name] && new Date(formik.values[item.name])) || null}
                      onChange={(val: any) => {
                        formik.setFieldValue(item.name, val);
                      }}
                    />
                  )
                } */}
                {
                  !["choices", "boolean", "date"].includes(item.type) && (
                    <input
                      type={item.type} name={item.name}
                      id={item.name}
                      placeholder={item.name}
                      onChange={formik.handleChange}
                      value={formik.values[item.name]}
                      style={{ width: "100%" }}
                      disabled={item.disabled}
                    />
                  )
                }
                {
                  formik.touched[item.name] && formik.errors[item.name] ? (
                    <div>{formik.errors[item.name] as string}</div>
                  ) : null
                }
              </div>
            )
          })
        }
      </div>
    </div>
  );
});


export default DynamicForm;