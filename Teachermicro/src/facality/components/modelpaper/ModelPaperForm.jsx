import { useReducer, useEffect } from "react";

const initialState = {
  subject: "",
  className: "",
  paperDate: "",
  file: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_ALL":
      return action.payload;

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

const ModelPaperForm = ({ initialData, onSave, onCancel }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (initialData) {
      dispatch({ type: "SET_ALL", payload: initialData });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(state);
    dispatch({ type: "RESET" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-medium">
        {initialData ? "Edit Model Paper" : "Add Model Paper"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          className="input-style"
          required
          value={state.subject}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "subject", value: e.target.value })
          }
        >
          <option value="">Select Subject</option>
          <option>Computer Science</option>
          <option>Mathematics</option>
          <option>Physics</option>
        </select>

        <select
          className="input-style"
          required
          value={state.className}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "className", value: e.target.value })
          }
        >
          <option value="">Select Class</option>
          <option>BCA 1st Year</option>
          <option>BCA 2nd Year</option>
          <option>BCA 3rd Year</option>
        </select>
      </div>

      <input
        type="date"
        className="input-style"
        required
        value={state.paperDate}
        onChange={(e) =>
          dispatch({ type: "SET_FIELD", field: "paperDate", value: e.target.value })
        }
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="input-style cursor-pointer"
        required={!initialData}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "file",
            value: e.target.files[0],
          })
        }
      />

      <div className="flex gap-3">
        <button className="bg-[var(--primary)] text-white px-3 py-2 rounded-lg">Save</button>
        <button type="button" onClick={onCancel} className="btn-outline border rounded-lg px-2">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ModelPaperForm;
