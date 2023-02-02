import React, { useState } from "react";
import { Input, Typography, Row, Col, Button } from "antd";
import useForm from "./useForm";
import "./App.css";

const { Title } = Typography;

// const [data, setData] = useState("Password not matched");

function Form() {
  // Define your state schema
  const stateSchema = {
    first_name: { value: "", error: "" },
    last_name: { value: "", error: "" },
    tags: { value: "", error: "" },
    password: { value: "", error: "" },
    confirm_password: { value: "", error: "" }
  };

  // Create your own validationStateSchema
  // stateSchema property should be the same in validationStateSchema
  // in-order a validation to works in your input.
  const stateValidatorSchema = {
    first_name: {
      required: true,
      validator: {
        func: (value) => /^[a-zA-Z]+$/.test(value),
        error: "Invalid first name format."
      }
    },
    last_name: {
      required: true,
      validator: {
        func: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value),
        error: "Invalid last name format."
      }
    },
    tags: {
      required: true,
      validator: {
        func: (value) => /^(,?\w{10,})+$/.test(value),
        error: "Invalid tag format."
      },
    },
    password: {
      required: true,
      validator: {
        func: (value) => /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g.test(value),
        error: "Invalid Password"
      },
    },
    confirm_password: {
      required: true,
      validator: {
        func: (value) => /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g.test(value),
        error: "Invalid Confirm Password"
      },
    },
  };

  const [data, setData] = useState([]);

  function onSubmitForm(state) {
    setData([...data, state])
  }

  console.log("data", data);

  const {
    values,
    errors,
    dirty,
    handleOnChange,
    handleOnSubmit,
    disable
  } = useForm(stateSchema, stateValidatorSchema, onSubmitForm);

  const { first_name, last_name, tags, password, confirm_password } = values;

  return (
    <>
      <form className="my-form" onSubmit={handleOnSubmit}>
        <Title level={3}>Registration Form</Title>
        <Row>
          <Col span={4}>Name</Col>
          <Col span={18}>
            <Input
              type="text"
              name="first_name"
              value={first_name}
              onChange={handleOnChange}
            />
            {errors.first_name && dirty.first_name && (
              <p className="error">{errors.first_name}</p>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={4}>E-Mail</Col>
          <Col span={18}>
            <Input
              type="text"
              name="last_name"
              value={last_name}
              onChange={handleOnChange}
            />
            {errors.last_name && dirty.last_name && (
              <p className="error">{errors.last_name}</p>
            )}
          </Col>
        </Row>

        <Row>
          <Col span={4}>Phone Number</Col>
          <Col span={18}>
            <Input
              type="number"
              name="tags"
              value={tags}
              onChange={handleOnChange}
            />{" "}
            {errors.tags && dirty.tags && <p className="error">{errors.tags}</p>}
          </Col>
        </Row>
        <Row>
          <Col span={4}>Password</Col>
          <Col span={18}>
            <Input
              type="text"
              name="password"
              value={password}
              onChange={handleOnChange}
            />{" "}
            {errors.password && dirty.password && <p className="error">{errors.password}</p>}
          </Col>
        </Row>
        <Row>
          <Col span={4}>Confirm Password</Col>
          <Col span={18}>
            <Input
              type="text"
              name="confirm_password"
              value={confirm_password}
              onChange={handleOnChange}
            />{" "}
            {errors.confirm_password && dirty.confirm_password && <p className="error">{errors.confirm_password}</p>}
          </Col>
        </Row>
        <Row>
          <Col span={18} push={4}>
            <Button htmlType="submit" type="primary" disabled={disable}>
              Submit
            </Button>
          </Col>
        </Row>
      </form>
      <div className="mt-4">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">tags</th>
              <th scope="col">Password</th>
              <th scope="col">Confirm Password</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <>
                  <tr key={index}>
                    <th scope="row">{item.first_name}</th>
                    <td>{item.last_name}</td>
                    <td>{item.tags}</td>
                    <td>{item.password}</td>
                    <td>{item.confirm_password}</td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Form;