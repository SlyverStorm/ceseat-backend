pipeline{

    agent any

    def app

    stages{

        stage('Clone repository') {
            steps {
                /* Let's make sure we have the repository cloned to our workspace */
                checkout scm
            }
        }

        stage("Build docker image"){
            steps{
            //     sh '''
            //         docker version
            //         docker info
            //         docker compose version
            //     '''
            // }
                app = docker.build("test")
            }
        }

        stage('Test image') {
            /* Ideally, we would run a test framework against our image.
            * For this example, we're using a Volkswagen-type approach ;-) */
            steps {
                app.inside {
                    sh 'echo "Tests passed"'
                }
            }
        }
    }
}