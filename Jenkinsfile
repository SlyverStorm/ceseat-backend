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

    stage("Building docker images") {
        def packageInfo = readJSON(file:'package.json')
        sh '''
            docker build -t slyverstorm16/ceseat-ms-auth:${packageInfo.version} ./apps/ms-auth/
        '''
    }

    // stage("Push docker images") {
    //     steps {
    //         sh '''
    //             docker-compose push
    //         '''
    //     }
    // }

    stage("Prune docker data") {
        sh """
            docker system prune -a --volumes -f
        """
    }

    stage("Start containers") {
        sh "docker-compose up -d"
    }

}