pipeline{
    agent any
    stages{
        stage("tooling"){
            steps{
                sh '''
                    docker version
                    docker info
                    docker compose version
                '''
            }
        }
    }
}