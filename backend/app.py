from flask import Flask, jsonify
from flask_cors import CORS
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
from routes.decompose import decompose_bp
from routes.schedule import schedule_bp
from routes.execute import execute_bp
from routes.replan import replan_bp
from routes.assign_roles import assign_roles_bp
from routes.risk import risk_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(decompose_bp)
    app.register_blueprint(schedule_bp)
    app.register_blueprint(execute_bp)
    app.register_blueprint(replan_bp)
    app.register_blueprint(assign_roles_bp)
    app.register_blueprint(risk_bp)

    @app.get("/api/health")
    def health_check():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
