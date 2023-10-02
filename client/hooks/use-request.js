import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    // This enables us to add additional properties.
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props }); // using spread operator to add additional properties...

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {/* {err.response.data.errors.map((err) => ( // We need to find our the formate/data type of the error, we need to ensure it is an error. 
            ))} */}
            <li key={err.message}>{err.message}</li>
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
