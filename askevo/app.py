"""
Flask application for the AskEvo genetic assistant chatbot.
"""

import os
from flask import Flask, render_template, request, jsonify
from askevo.genetic_assistant import GeneticAssistant


def create_app(config=None):
    """Create and configure the Flask application."""
    app = Flask(
        __name__,
        template_folder=os.path.join(os.path.dirname(__file__), "..", "templates"),
        static_folder=os.path.join(os.path.dirname(__file__), "..", "static"),
    )

    # Default configuration
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
    app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", "False").lower() == "true"

    # Apply custom configuration if provided
    if config:
        app.config.update(config)

    # Initialize the genetic assistant
    assistant = GeneticAssistant()

    @app.route("/")
    def index():
        """Render the main chat interface."""
        return render_template("index.html")

    @app.route("/api/chat", methods=["POST"])
    def chat():
        """Handle chat messages and return assistant responses."""
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"error": "No message provided"}), 400

        user_message = data["message"]

        if not user_message.strip():
            return jsonify({"error": "Empty message"}), 400

        try:
            response = assistant.get_response(user_message)
            return jsonify({"response": response})
        except (KeyError, ValueError) as e:
            return jsonify({"error": f"Processing error: {str(e)}"}), 500

    @app.route("/api/search", methods=["GET"])
    def search():
        """Search for genetic conditions."""
        query = request.args.get("q", "")

        if not query.strip():
            return jsonify({"results": []})

        results = assistant.search_conditions(query)
        return jsonify({"results": results})

    @app.route("/api/condition/<condition_name>", methods=["GET"])
    def get_condition(condition_name):
        """Get details about a specific condition."""
        details = assistant.get_condition_details(condition_name)

        if details:
            return jsonify(details)
        return jsonify({"error": "Condition not found"}), 404

    @app.route("/api/clear", methods=["POST"])
    def clear_history():
        """Clear conversation history."""
        assistant.clear_history()
        return jsonify({"status": "cleared"})

    @app.route("/health")
    def health():
        """Health check endpoint."""
        return jsonify({"status": "healthy", "version": "1.0.0"})

    return app


# Create the application instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
