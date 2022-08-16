// pipeline {
//     agent any
//     stages {
//         stage("Verify tooling") {
//             steps {
//                 sh '''
//                     docker version
//                     docker compose version
//                     docker info
//                 '''
//             }
//         }

//         stage("Clone repository data") {
//             steps {
//                 checkout scm
//             }
//         }

//         stage("Building docker images") {
//             steps {
//                 def packageInfo = readJSON file:'package.json'
//                 sh '''
//                     docker build -t slyverstorm16/ceseat-ms-auth:${packageInfo.version} ./apps/ms-auth/
//                 '''
//             }
//         }

//         // stage("Push docker images") {
//         //     steps {
//         //         sh '''
//         //             docker-compose push
//         //         '''
//         //     }
//         // }

//         stage("Prune docker data") {
//             steps {
//                 sh """
//                     docker system prune -a --volumes -f
//                 """
//             }
//         }

//         stage("Start containers") {
//             steps {
//                 sh "docker-compose up -d"
//             }
//         }

//     }
// }

node {
    stage("Verify tooling") {
        sh '''
            docker version
            docker compose version
            docker info
        '''
    }

    stage("Clone repository data") {
        checkout scm
    }

    stage ("Logging to Docker Hub") {
        withCredentials([string(credentialsId: 'slyverstorm16-dockerhub-secret', variable: 'dockerHubPwd')]) {
            sh "docker login -u slyverstorm16 -p \"${dockerHubPwd}\""
        }
    }

    stage("Building docker images") {
        sh '''
            version=`cat package.json | grep -oP '(?<=\"version\": \")[^\"]*'`
            docker build -t slyverstorm16/ceseat-ms-auth:$version ./apps/ms-auth/
            docker build -t slyverstorm16/ceseat-ms-restaurant:$version ./apps/ms-restaurant/
            docker build -t slyverstorm16/ceseat-ms-order:$version ./apps/ms-order/
        '''
    }

    stage("Push docker images") {
        sh '''
            version=`cat package.json | grep -oP '(?<=\"version\": \")[^\"]*'`
            docker push slyverstorm16/ceseat-ms-auth:$version
            docker push slyverstorm16/ceseat-ms-restaurant:$version
            docker push slyverstorm16/ceseat-ms-order:$version
        '''
    }

    stage("Prune docker data") {
        sh """
            docker system prune -a --volumes -f
        """
    }

    stage("Start containers") {
        sh "docker-compose up -d"
    }

}