import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__, 
           template_folder='quizifytube/templates',
           static_folder='static')
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///quiz.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)

@app.route('/')
def index():
    # YouTube video ID for a sample educational video
    video_id = "dQw4w9WgXcQ"  # Replace with your educational video ID
    return render_template('index.html', video_id=video_id)

with app.app_context():
    import models
    db.create_all()
