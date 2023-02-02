import { useState, useEffect, useCallback } from "react";

const VALUE = "value";
const ERROR = "error";
const REQUIRED_FIELD_ERROR = "This field is required ";

/**
 * Determines a value if it's an object
 *
 * @param {object} value
 */
function is_object(value) {
  return typeof value === "object" && value !== null;
}

/**
 *
 * @param {string} value
 * @param {boolean} isRequired
 */
function is_required(value, isRequired) {
  if (!value && isRequired) return REQUIRED_FIELD_ERROR;
  return "";
}

function get_prop_values(stateSchema, prop) {
  return Object.keys(stateSchema).reduce((accumulator, curr) => {
    accumulator[curr] = !prop ? false : stateSchema[curr][prop];

    return accumulator;
  }, {});
}

/**
 * @param {object} stateSchema model you stateSchema.
 * @param {object} stateValidatorSchema model your validation.
 * @param {function} submitFormCallback function to be execute during form submission.
 */

function useForm(
  stateSchema = {},
  stateValidatorSchema = {},
  submitFormCallback
) {
  const [state, setStateSchema] = useState(stateSchema);

  const [values, setValues] = useState(get_prop_values(state, VALUE));
  const [errors, setErrors] = useState(get_prop_values(state, ERROR));
  const [dirty, setDirty] = useState(get_prop_values(state));

  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setStateSchema(stateSchema);
    setDisable(true); 
    setInitialErrorState();
  }, []);

  useEffect(() => {
    if (isDirty) {
      if (!validateErrorState() && values.password !== values.confirm_password) {
        setErrors({
          ...errors,
          confirm_password: 'Password does not match'
        })
      } else if (validateErrorState() && values.confirm_password === values.password){
        setErrors({
          ...errors,
          confirm_password: ''
        })
      } else
      setDisable(validateErrorState());
    }
    // console.log(isDirty, validateErrorState());

  }, [errors, isDirty]);

  // Validate fields in forms
  const validateFormFields = useCallback(
    (name, value) => {
      const validator = stateValidatorSchema;
 
      if (!validator[name]) return;

      const field = validator[name];

      let error = "";
      error = is_required(value, field.required);

      if (is_object(field["validator"]) && error === "") {
        const fieldValidator = field["validator"];

        const testFunc = fieldValidator["func"];
        if (!testFunc(value, values)) {
          error = fieldValidator["error"];
        }
      }

      return error;
    },
    [stateValidatorSchema, values]
  );

  const setInitialErrorState = useCallback(() => {
    Object.keys(errors).map(name =>
      setErrors(prevState => ({
        ...prevState,
        [name]: validateFormFields(name, values[name])
      }))
    );
  }, [errors, values, validateFormFields]);

  const validateErrorState = useCallback(
    () => Object.values(errors).some(error => error),
    [errors]
  );

  const handleOnChange = useCallback(
    event => {
      setIsDirty(true);

      const name = event.target.name;
      const value = event.target.value;

      const error = validateFormFields(name, value);

      setValues(prevState => ({ ...prevState, [name]: value }));
      if (values.password !== values.confirm_password) {
        setErrors(prevState => ({ ...prevState, [name]: error }));
      }
      setErrors(prevState => ({ ...prevState, [name]: error }));
      setDirty(prevState => ({ ...prevState, [name]: true }));
    },
    [validateFormFields]
  );

  const handleOnSubmit = useCallback(
    event => {
      event.preventDefault();

      if (!validateErrorState()) {
        submitFormCallback(values);
      }
      setValues({
        first_name: "",
        last_name: "",
        tags: "",
        password: "",
        confirm_password: "",  
      })
    },

    [validateErrorState, submitFormCallback, values]

  );

  return {
    handleOnChange,
    handleOnSubmit,
    values,
    errors,
    disable,
    setValues,
    setErrors,
    dirty
  };
}

export default useForm;
