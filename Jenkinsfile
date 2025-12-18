pipeline {
    agent any

    stages {
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                echo "Deploying to Kubernetes..."
                kubectl get nodes
                kubectl apply -f k8s/ --validate=false
                '''
            }
        }
    }
}
