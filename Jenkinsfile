pipeline {
    agent any
    stages {
        stage("Verify tooling") {
            steps {
                sh '''
                    docker version
                    docker compose version
                    docker info
                '''
            }
        }

        stage("Clone repository data") {
            steps {
                checkout scm
            }
        }

        stage("Prune docker data") {
            steps {
                sh "docker system prune -a --volumes -f"
            }
        }

        stage("Start containers") {
            steps {
                sh "docker-compose up"
            }
        }

    }
}