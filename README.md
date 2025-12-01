# AskEvo - AI Genetic Assistant 🧬

An AI-powered genetic assistant and chatbot designed to help doctors and genetic counsellors speed up the diagnosis process for genetic conditions.

## Features

- **Genetic Condition Information**: Detailed information about common genetic disorders including symptoms, inheritance patterns, and diagnostic approaches
- **Inheritance Pattern Guidance**: Explanations of autosomal dominant, autosomal recessive, X-linked, and mitochondrial inheritance
- **Genetic Testing Recommendations**: Guidance on appropriate diagnostic tests (karyotype, FISH, microarray, WES, WGS)
- **Symptom-Based Analysis**: Differential diagnosis support based on clinical presentations
- **Interactive Chat Interface**: Easy-to-use web interface for healthcare professionals

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Progenics2025/askevo_v2.git
cd askevo_v2
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Running the Application

Start the development server:
```bash
python -m askevo.app
```

The application will be available at `http://localhost:5000`

### Running with Gunicorn (Production)

```bash
gunicorn askevo.app:app -b 0.0.0.0:5000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main chat interface |
| `/api/chat` | POST | Send message to assistant |
| `/api/search` | GET | Search genetic conditions |
| `/api/condition/<name>` | GET | Get condition details |
| `/api/clear` | POST | Clear conversation history |
| `/health` | GET | Health check endpoint |

### Example API Usage

```bash
# Send a chat message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about cystic fibrosis"}'

# Search conditions
curl http://localhost:5000/api/search?q=sickle
```

## Development

### Running Tests

```bash
# Install dev dependencies
pip install -r requirements.txt

# Run tests
pytest

# Run tests with coverage
pytest --cov=askevo --cov-report=html
```

### Code Formatting

```bash
# Format code with black
black askevo/ tests/

# Sort imports
isort askevo/ tests/

# Lint with flake8
flake8 askevo/ tests/
```

## Supported Genetic Conditions

- Cystic Fibrosis (CFTR gene)
- Huntington's Disease (HTT gene)
- Sickle Cell Disease (HBB gene)
- Down Syndrome (Chromosome 21)
- Duchenne Muscular Dystrophy (DMD gene)
- Phenylketonuria (PAH gene)

## Project Structure

```
askevo_v2/
├── askevo/
│   ├── __init__.py
│   ├── app.py              # Flask application
│   └── genetic_assistant.py # Core AI assistant
├── templates/
│   └── index.html          # Web interface
├── static/
│   ├── style.css           # Styles
│   └── script.js           # Frontend JavaScript
├── tests/
│   ├── test_app.py         # API tests
│   └── test_genetic_assistant.py # Core logic tests
├── requirements.txt
├── pyproject.toml
└── README.md
```

## Disclaimer

⚠️ **For Healthcare Professional Use Only**

This tool is designed to assist healthcare professionals and genetic counsellors. It is not intended to replace clinical judgment or serve as a diagnostic tool. Always verify information through authoritative medical sources and consult with qualified healthcare providers.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
