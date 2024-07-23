from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xgboost as xgb
import pandas as pd

# Load the trained model
model = xgb.XGBClassifier()
model.load_model("brain_stroke_xgb_with_modified_oversampling.json")

# Initialize FastAPI
app = FastAPI()

# Define allowed origins for CORS
origins = [
    "*",  # Allow all origins, change to specific origins if necessary
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input data model
class StrokePredictionInput(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    ever_married: str
    work_type: str
    Residence_type: str
    avg_glucose_level: float
    bmi: float
    smoking_status: str

# Define the prediction endpoint
@app.post("/predict")
async def predict(input_data: StrokePredictionInput):
    # Convert input data to DataFrame
    data = {
        "gender": [input_data.gender],
        "age": [input_data.age],
        "hypertension": [input_data.hypertension],
        "heart_disease": [input_data.heart_disease],
        "ever_married": [input_data.ever_married],
        "work_type": [input_data.work_type],
        "Residence_type": [input_data.Residence_type],
        "avg_glucose_level": [input_data.avg_glucose_level],
        "bmi": [input_data.bmi],
        "smoking_status": [input_data.smoking_status]
    }
    df = pd.DataFrame(data)

    # Encode categorical features
    df['gender'] = df['gender'].replace({"Male": 0, "Female": 1})
    df['ever_married'] = df['ever_married'].replace({"No": 1, "Yes": 0})
    df['work_type'] = df['work_type'].replace({
        "Govt_job": 2, "children": 3, "Private": 0, "Self-employed": 1
    })
    df['Residence_type'] = df['Residence_type'].replace({"Urban": 0, "Rural": 1})
    df['smoking_status'] = df['smoking_status'].replace({
        "formerly smoked": 0, "never smoked": 1, "smokes": 2
    })

    # Make prediction
    prediction = model.predict(df)

    # Return the prediction
    return {
        "prediction": int(prediction[0])
    }
