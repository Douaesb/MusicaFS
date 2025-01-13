pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'musica-app'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Douaesb/Musica.git'
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean install -DskipTests'
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE} .'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
