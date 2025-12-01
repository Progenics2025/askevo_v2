"""
Core genetic assistant module providing AI-powered assistance for genetic diagnosis.
"""

from typing import Optional


class GeneticAssistant:
    """
    AI-powered genetic assistant that helps doctors and genetic counsellors
    with diagnosis support, genetic information lookup, and patient analysis.
    """

    def __init__(self):
        """Initialize the genetic assistant with knowledge base."""
        self.knowledge_base = self._load_knowledge_base()
        self.conversation_history = []

    def _load_knowledge_base(self) -> dict:
        """Load the genetic knowledge base with common conditions and information."""
        return {
            "conditions": {
                "cystic_fibrosis": {
                    "name": "Cystic Fibrosis",
                    "gene": "CFTR",
                    "inheritance": "Autosomal Recessive",
                    "symptoms": [
                        "Chronic lung infections",
                        "Digestive problems",
                        "Salty sweat",
                        "Poor growth",
                    ],
                    "diagnosis": "Sweat chloride test, genetic testing for CFTR mutations",
                    "description": "A genetic disorder affecting the lungs and digestive system.",
                },
                "huntingtons_disease": {
                    "name": "Huntington's Disease",
                    "gene": "HTT",
                    "inheritance": "Autosomal Dominant",
                    "symptoms": [
                        "Movement disorders",
                        "Cognitive decline",
                        "Psychiatric symptoms",
                    ],
                    "diagnosis": "Genetic testing for CAG repeat expansion in HTT gene",
                    "description": "A progressive neurodegenerative disorder.",
                },
                "sickle_cell_disease": {
                    "name": "Sickle Cell Disease",
                    "gene": "HBB",
                    "inheritance": "Autosomal Recessive",
                    "symptoms": [
                        "Anemia",
                        "Pain crises",
                        "Frequent infections",
                        "Delayed growth",
                    ],
                    "diagnosis": "Hemoglobin electrophoresis, genetic testing",
                    "description": "A blood disorder causing abnormal hemoglobin.",
                },
                "down_syndrome": {
                    "name": "Down Syndrome",
                    "gene": "Chromosome 21 trisomy",
                    "inheritance": "Chromosomal",
                    "symptoms": [
                        "Intellectual disability",
                        "Distinctive facial features",
                        "Heart defects",
                        "Developmental delays",
                    ],
                    "diagnosis": "Karyotype analysis, prenatal screening tests",
                    "description": (
                        "A chromosomal condition caused by an extra copy of chromosome 21."
                    ),
                },
                "muscular_dystrophy": {
                    "name": "Duchenne Muscular Dystrophy",
                    "gene": "DMD",
                    "inheritance": "X-linked Recessive",
                    "symptoms": [
                        "Progressive muscle weakness",
                        "Difficulty walking",
                        "Enlarged calves",
                        "Cardiac complications",
                    ],
                    "diagnosis": "Creatine kinase test, genetic testing, muscle biopsy",
                    "description": "A genetic disorder causing progressive muscle degeneration.",
                },
                "phenylketonuria": {
                    "name": "Phenylketonuria (PKU)",
                    "gene": "PAH",
                    "inheritance": "Autosomal Recessive",
                    "symptoms": [
                        "Intellectual disability if untreated",
                        "Seizures",
                        "Behavioral problems",
                        "Musty odor",
                    ],
                    "diagnosis": "Newborn screening blood test, phenylalanine level testing",
                    "description": "A metabolic disorder affecting amino acid processing.",
                },
            },
            "inheritance_patterns": {
                "autosomal_dominant": {
                    "description": (
                        "Only one copy of the mutated gene is needed to cause the disorder"
                    ),
                    "risk": "50% chance of passing to offspring if one parent is affected",
                },
                "autosomal_recessive": {
                    "description": (
                        "Two copies of the mutated gene are needed to cause the disorder"
                    ),
                    "risk": "25% chance of affected child if both parents are carriers",
                },
                "x_linked_recessive": {
                    "description": (
                        "The mutation is on the X chromosome, primarily affecting males"
                    ),
                    "risk": (
                        "50% of sons affected if mother is carrier, 50% of daughters carriers"
                    ),
                },
                "x_linked_dominant": {
                    "description": (
                        "The mutation is on the X chromosome and one copy causes the disorder"
                    ),
                    "risk": "50% of all children affected if mother has condition",
                },
                "mitochondrial": {
                    "description": "Inherited through maternal mitochondrial DNA",
                    "risk": "All children of affected mother will inherit the mutation",
                },
            },
            "genetic_tests": {
                "karyotype": "Analysis of chromosome number and structure",
                "fish": "Fluorescence In Situ Hybridization for specific chromosomal abnormalities",
                "microarray": "Chromosomal microarray for copy number variations",
                "sequencing": "DNA sequencing to identify gene mutations",
                "whole_exome": "Sequencing of all protein-coding regions",
                "whole_genome": "Complete genome sequencing",
            },
        }

    def get_response(self, user_message: str) -> str:
        """
        Process user message and generate an appropriate response.

        Args:
            user_message: The input message from the user

        Returns:
            A response string from the genetic assistant
        """
        self.conversation_history.append({"role": "user", "content": user_message})

        message_lower = user_message.lower()

        # Check for condition-specific queries
        condition_info = self._check_condition_query(message_lower)
        if condition_info:
            response = condition_info
        # Check for inheritance pattern queries
        elif any(
            pattern in message_lower
            for pattern in ["inheritance", "inherited", "hereditary", "pass"]
        ):
            response = self._handle_inheritance_query(message_lower)
        # Check for genetic testing queries
        elif any(test in message_lower for test in ["test", "diagnosis", "diagnose", "screening"]):
            response = self._handle_testing_query(message_lower)
        # Check for symptom-based queries
        elif any(word in message_lower for word in ["symptom", "sign", "present", "show"]):
            response = self._handle_symptom_query(message_lower)
        # General greetings and help
        elif any(word in message_lower for word in ["hello", "hi", "help", "start"]):
            response = self._get_welcome_message()
        # Default response for unrecognized queries
        else:
            response = self._get_general_response(user_message)

        self.conversation_history.append({"role": "assistant", "content": response})
        return response

    def _check_condition_query(self, message: str) -> Optional[str]:
        """Check if the message asks about a specific genetic condition."""
        condition_keywords = {
            "cystic_fibrosis": ["cystic fibrosis", "cf", "cftr"],
            "huntingtons_disease": ["huntington", "htt", "chorea"],
            "sickle_cell_disease": ["sickle cell", "sickle", "hbb"],
            "down_syndrome": ["down syndrome", "down's", "trisomy 21"],
            "muscular_dystrophy": [
                "muscular dystrophy",
                "duchenne",
                "dmd",
                "dystrophin",
            ],
            "phenylketonuria": ["pku", "phenylketonuria", "pah"],
        }

        for condition_key, keywords in condition_keywords.items():
            if any(keyword in message for keyword in keywords):
                return self._format_condition_info(condition_key)

        return None

    def _format_condition_info(self, condition_key: str) -> str:
        """Format detailed information about a genetic condition."""
        condition = self.knowledge_base["conditions"].get(condition_key)
        if not condition:
            return "I don't have detailed information about that condition."

        response = f"**{condition['name']}**\n\n"
        response += f"📖 **Description:** {condition['description']}\n\n"
        response += f"🧬 **Associated Gene:** {condition['gene']}\n\n"
        response += f"👨‍👩‍👧 **Inheritance Pattern:** {condition['inheritance']}\n\n"
        response += "🩺 **Common Symptoms:**\n"
        for symptom in condition["symptoms"]:
            response += f"  • {symptom}\n"
        response += f"\n🔬 **Diagnosis:** {condition['diagnosis']}\n\n"
        response += (
            "Would you like more specific information about this condition, "
            "such as management options or genetic counseling considerations?"
        )

        return response

    def _handle_inheritance_query(self, message: str) -> str:
        """Handle queries about inheritance patterns."""
        patterns = self.knowledge_base["inheritance_patterns"]

        # Check for specific inheritance pattern
        if "dominant" in message and "autosomal" in message:
            pattern = patterns["autosomal_dominant"]
            return (
                f"**Autosomal Dominant Inheritance:**\n\n{pattern['description']}\n\n"
                f"**Risk Assessment:** {pattern['risk']}"
            )
        elif "recessive" in message and "autosomal" in message:
            pattern = patterns["autosomal_recessive"]
            return (
                f"**Autosomal Recessive Inheritance:**\n\n{pattern['description']}\n\n"
                f"**Risk Assessment:** {pattern['risk']}"
            )
        elif "x-linked" in message or "x linked" in message:
            if "dominant" in message:
                pattern = patterns["x_linked_dominant"]
                return (
                    f"**X-linked Dominant Inheritance:**\n\n{pattern['description']}\n\n"
                    f"**Risk Assessment:** {pattern['risk']}"
                )
            else:
                pattern = patterns["x_linked_recessive"]
                return (
                    f"**X-linked Recessive Inheritance:**\n\n{pattern['description']}\n\n"
                    f"**Risk Assessment:** {pattern['risk']}"
                )
        elif "mitochondrial" in message:
            pattern = patterns["mitochondrial"]
            return (
                f"**Mitochondrial Inheritance:**\n\n{pattern['description']}\n\n"
                f"**Risk Assessment:** {pattern['risk']}"
            )

        # General inheritance overview
        response = "**Inheritance Patterns in Genetics:**\n\n"
        response += "I can provide information about:\n"
        response += "• **Autosomal Dominant** - One copy of mutated gene causes condition\n"
        response += "• **Autosomal Recessive** - Two copies needed for condition\n"
        response += "• **X-linked Recessive** - Primarily affects males\n"
        response += "• **X-linked Dominant** - One copy on X causes condition\n"
        response += "• **Mitochondrial** - Inherited from mother only\n\n"
        response += "Which inheritance pattern would you like to learn more about?"
        return response

    def _handle_testing_query(self, message: str) -> str:
        """Handle queries about genetic testing."""
        tests = self.knowledge_base["genetic_tests"]

        # Check for specific test types
        if "karyotype" in message:
            return (
                f"**Karyotype Analysis:**\n\n{tests['karyotype']}\n\n"
                "This test is used to identify chromosomal abnormalities such as "
                "aneuploidies (like Down syndrome) or structural rearrangements."
            )
        elif "fish" in message:
            return (
                f"**FISH (Fluorescence In Situ Hybridization):**\n\n{tests['fish']}\n\n"
                "FISH uses fluorescent probes to detect specific DNA sequences "
                "and is commonly used for rapid aneuploidy detection."
            )
        elif "microarray" in message:
            return (
                f"**Chromosomal Microarray:**\n\n{tests['microarray']}\n\n"
                "This test can detect small deletions or duplications "
                "that may not be visible on karyotype."
            )
        elif "whole exome" in message or "wes" in message:
            return (
                f"**Whole Exome Sequencing (WES):**\n\n{tests['whole_exome']}\n\n"
                "WES analyzes all protein-coding genes and is useful "
                "for diagnosing rare genetic disorders."
            )
        elif "whole genome" in message or "wgs" in message:
            return (
                f"**Whole Genome Sequencing (WGS):**\n\n{tests['whole_genome']}\n\n"
                "WGS provides the most comprehensive genetic analysis, "
                "including non-coding regions."
            )

        # General testing overview
        response = "**Genetic Testing Options:**\n\n"
        response += "Available genetic tests include:\n\n"
        for test_name, description in tests.items():
            formatted_name = test_name.replace("_", " ").title()
            response += f"• **{formatted_name}:** {description}\n"
        response += (
            "\nWould you like details about a specific test "
            "or help choosing the right test for your patient?"
        )
        return response

    def _handle_symptom_query(self, message: str) -> str:
        """Handle symptom-based queries for differential diagnosis support."""
        symptoms_found = []
        possible_conditions = []

        # Check for symptoms in the message
        symptom_keywords = {
            "muscle": ["muscular_dystrophy"],
            "weakness": ["muscular_dystrophy"],
            "lung": ["cystic_fibrosis"],
            "respiratory": ["cystic_fibrosis"],
            "digestive": ["cystic_fibrosis"],
            "anemia": ["sickle_cell_disease"],
            "pain": ["sickle_cell_disease"],
            "movement": ["huntingtons_disease"],
            "cognitive": ["huntingtons_disease", "down_syndrome", "phenylketonuria"],
            "developmental": ["down_syndrome", "phenylketonuria"],
            "seizure": ["phenylketonuria"],
        }

        for keyword, conditions in symptom_keywords.items():
            if keyword in message:
                symptoms_found.append(keyword)
                possible_conditions.extend(conditions)

        if possible_conditions:
            unique_conditions = list(set(possible_conditions))
            response = "**Differential Diagnosis Support:**\n\n"
            response += (
                f"Based on the symptoms mentioned ({', '.join(symptoms_found)}), consider:\n\n"
            )
            for condition_key in unique_conditions:
                condition = self.knowledge_base["conditions"].get(condition_key)
                if condition:
                    response += f"• **{condition['name']}** ({condition['inheritance']})\n"
                    response += f"  Gene: {condition['gene']}\n"
                    response += f"  Key test: {condition['diagnosis']}\n\n"
            response += "Would you like more details about any of these conditions?"
            return response

        return (
            "Please describe the specific symptoms you're seeing in the patient, "
            "and I can help suggest possible genetic conditions to consider "
            "and appropriate testing strategies."
        )

    def _get_welcome_message(self) -> str:
        """Return the welcome message for new users."""
        return (
            "**Welcome to AskEvo - AI Genetic Assistant** 🧬\n\n"
            "I'm here to help doctors and genetic counsellors with genetic "
            "diagnosis support. I can assist with:\n\n"
            "• **Genetic Conditions** - Information about inherited disorders\n"
            "• **Inheritance Patterns** - Understanding how conditions are passed on\n"
            "• **Genetic Testing** - Guidance on appropriate diagnostic tests\n"
            "• **Symptom Analysis** - Differential diagnosis support\n"
            "• **Risk Assessment** - Help with genetic counseling considerations\n\n"
            "How can I assist you today? You can ask about specific genetic conditions, "
            "inheritance patterns, or describe symptoms for differential diagnosis support."
        )

    def _get_general_response(self, message: str) -> str:
        """Generate a general response for unrecognized queries."""
        return (
            f'I understand you\'re asking about: "{message}"\n\n'
            "To better assist you, could you please clarify if you're looking for:\n\n"
            '1. **Information about a specific genetic condition** '
            '(e.g., "Tell me about cystic fibrosis")\n'
            '2. **Inheritance pattern guidance** '
            '(e.g., "Explain autosomal dominant inheritance")\n'
            '3. **Genetic testing recommendations** '
            '(e.g., "What tests for suspected muscular dystrophy")\n'
            '4. **Symptom-based analysis** '
            '(e.g., "Patient has muscle weakness and cognitive delay")\n\n'
            "Please provide more specific details about your query, "
            "and I'll do my best to help with your genetic diagnosis needs."
        )

    def search_conditions(self, query: str) -> list:
        """
        Search for genetic conditions matching the query.

        Args:
            query: Search term for conditions

        Returns:
            List of matching condition names
        """
        query_lower = query.lower()
        matches = []

        for key, condition in self.knowledge_base["conditions"].items():
            if (
                query_lower in condition["name"].lower()
                or query_lower in condition["gene"].lower()
                or query_lower in condition["description"].lower()
            ):
                matches.append(condition["name"])

        return matches

    def get_condition_details(self, condition_name: str) -> Optional[dict]:
        """
        Get detailed information about a specific condition.

        Args:
            condition_name: Name of the genetic condition

        Returns:
            Dictionary with condition details or None if not found
        """
        for key, condition in self.knowledge_base["conditions"].items():
            if condition_name.lower() in condition["name"].lower():
                return condition
        return None

    def clear_history(self):
        """Clear the conversation history."""
        self.conversation_history = []
