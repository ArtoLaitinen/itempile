import React, { useContext, useEffect } from "react";
import {
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import EditModalContext from "../utils/EditModalContext";
import Categories from "../utils/Categories";
import "./EditModal.css";

function EditModal({ refetch }) {
  const [editModalState, updateEditModalState] = useContext(EditModalContext);

  const handleModalClose = () => {
    updateEditModalState({
      isEditModalOpen: false,
      item: {
        title: "",
        description: "",
        image: "",
        category: "",
        price: "",
      },
    });
  };

  const onSubmit = () => {
    refetch();
    handleModalClose();
  };

  const formSchema = yup.object().shape({
    title: yup.string().required("Required"),
    description: yup.string().min(5).required("Required"),
    image: yup.string().required("Required"),
    category: yup.string().required("Required"),
    price: yup.number().required("Required"),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: "",
      category: "",
      price: "",
    },
    validationSchema: formSchema,
    onSubmit,
  });

  useEffect(() => {
    setValues({
      title: editModalState.item.title,
      description: editModalState.item.description,
      image: editModalState.item.image,
      category: editModalState.item.category,
      price: editModalState.item.price,
    });
  }, [editModalState.item, setValues]);

  return (
    <Modal open={editModalState.isEditModalOpen} onClose={handleModalClose}>
      <div className="modalStyle">
        <h1>Editing {editModalState.item.title}</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-item">
              <TextField
                id="title"
                type="text"
                label="Title"
                placeholder="Enter the title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title && touched.title}
                helperText={errors.title && touched.title ? errors.title : ""}
                className="form-input"
              />
            </div>

            <div className="form-item">
              <TextField
                id="description"
                type="text"
                label="Description"
                placeholder="Enter the description"
                multiline
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description && touched.description}
                helperText={
                  errors.description && touched.description
                    ? errors.description
                    : ""
                }
                className="form-input"
              />
            </div>

            <div className="form-item">
              <TextField
                id="image"
                type="text"
                label="Image"
                placeholder="Enter the image url"
                value={values.image}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.image && touched.image}
                helperText={errors.image && touched.image ? errors.image : ""}
                className="form-input"
              />
            </div>

            <div className="form-item">
              <FormControl fullWidth>
                <InputLabel id="selection-label">Category</InputLabel>
                <Select
                  labelId="selection-label"
                  id="category"
                  label="Category"
                  value={values.category}
                  onChange={(e) => {
                    const { value } = e.target;
                    handleChange("category")(value);
                  }}
                  error={errors.category && touched.category}
                >
                  {Categories.map((category, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <MenuItem value={category} key={index}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errors.image && touched.image ? errors.image : ""}
                </FormHelperText>
              </FormControl>
            </div>

            <div className="form-item">
              <TextField
                id="price"
                type="number"
                label="Price"
                placeholder="Enter the price"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.price && touched.price}
                helperText={errors.price && touched.price ? errors.price : ""}
                className="form-input"
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ width: "100%" }}
            >
              Update
            </Button>

            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleModalClose}
              sx={{ width: "100%", mt: "20px" }}
            >
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default EditModal;
