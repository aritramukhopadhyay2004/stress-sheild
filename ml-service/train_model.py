import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

def generate_biometric_dataset(n_samples=5000):
    np.random.seed(42)
    
    # Generate biometrics: heart_rate (40-180), skin_conductance (0.1-15), temperature (35-40)
    heart_rate = np.random.uniform(50, 160, n_samples)
    skin_conductance = np.random.uniform(0.2, 12.0, n_samples)
    temperature = np.random.uniform(35.5, 39.5, n_samples)
    
    # Calculate stress score heuristic with non-linear noise for training ground truth
    score = (
        np.maximum(0, (heart_rate - 75) / 15.0) +
        (skin_conductance / 1.5) +
        np.maximum(0, (temperature - 37.0) * 2.5) +
        np.random.normal(0, 0.4, n_samples)
    )
    
    # Classify into 4 categories: 0: LOW, 1: MODERATE, 2: HIGH, 3: CRITICAL
    labels = np.zeros(n_samples, dtype=int)
    labels[score >= 2.5] = 1
    labels[score >= 5.0] = 2
    labels[score >= 7.5] = 3
    
    X = np.column_stack([heart_rate, skin_conductance, temperature])
    return X, labels

def train_ensemble_model():
    print("Generating biometric dataset for Stress-Shield ML model training...")
    X, y = generate_biometric_dataset()
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    rf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    
    ensemble = VotingClassifier(
        estimators=[('random_forest', rf), ('gradient_boosting', gb)],
        voting='soft'
    )
    
    print("Training Ensemble ML Model (Random Forest + Gradient Boosting)...")
    ensemble.fit(X_scaled, y)
    
    output_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(output_dir, "model.joblib")
    scaler_path = os.path.join(output_dir, "scaler.joblib")
    
    joblib.dump(ensemble, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"[SUCCESS] ML Model saved to {model_path}")
    print(f"[SUCCESS] Scaler saved to {scaler_path}")

if __name__ == "__main__":
    train_ensemble_model()

