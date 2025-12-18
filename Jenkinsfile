pipeline {
  agent any

  environment {
    KUBECONFIG = "/var/jenkins_home/.kube/config"
  }

  stages {

    stage('Clone Repo') {
      steps {
        git branch: 'main', url: 'https://github.com/rakmol/results-checker-app.git'
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          cd k8s
          kubectl apply -f . --validate=false
        '''
      }
    }
  }
}

