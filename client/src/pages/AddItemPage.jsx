import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import AuthContext from "../utils/AuthContext";
import { addItem } from "../api/items";
import Categories from "../utils/Categories";

function AddItemPage() {
  useEffect(() => {
    // making sure that the top of the page is shown
    window.scrollTo(0, 0);
  }, []);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const addItemMutation = useMutation({
    mutationFn: addItem,
  });

  const onSubmit = async (values) => {
    try {
      await addItemMutation.mutateAsync({
        title: values.title,
        description: values.description,
        image: values.image,
        category: values.category,
        price: values.price.toString(),
        owner_id: auth.userId,
        token: auth.token,
      });
      toast.success("Item added successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error adding the item, please try again");
    }
  };

  const formSchema = yup.object().shape({
    title: yup.string().required("Required"),
    description: yup.string().min(5).required("Required"),
    image: yup.string().required("Required"),
    category: yup.string().required("Required"),
    price: yup.number().required("Required"),
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
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

  return (
    <>
      <h1>ADD AN ITEM</h1>
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
            color="warning"
            size="large"
            sx={{ width: "100%" }}
          >
            Add
          </Button>
        </form>
      </div>
    </>
  );
}

export default AddItemPage;
