pipeline {
  parameters {
    booleanParam(name: 'store', defaultValue: false, description: 'Store build')
    booleanParam(name: 'release', defaultValue: false, description: 'Release build')
    booleanParam(name: 'release_comment', defaultValue: true, description: 'Add comment to each issue and pull request resolved')
    password(name: 'GH_TOKEN', defaultValue: '', description: 'Github user token. Note: don\'t use a password, will be logged to console on error.')
    choice(name: 'agent', description: 'Agent', choices: ['Linux', 'Win'])
    choice(name: 'image', description: 'Docker Image', choices: ['node:10', 'node:11'])
    gitParameter(name: 'BRANCH', branchFilter: 'origin.*?/(.*)', defaultValue: 'master', type: 'PT_BRANCH_TAG', useRepository: 'rest')
  }
  triggers {
    pollSCM('* * * * *')
  }
  agent none
  stages {
    stage('Cleanup') {
      agent {
        label params.agent
      }
      steps {
        deleteDir()
      }
    }
    stage('Build') {
      agent {
        docker {
          image params.image
          label params.agent
        }
      }
      steps {
        sh '''
          npm install
          npm run build
        '''
      }
    }
    stage('Prepare') {
      when { 
        anyOf { 
          equals expected: true, actual: params.release
          equals expected: true, actual: params.store
        }
      }
      agent {
        docker {
          image params.image
          label params.agent
        }
      }
      steps {
        // sh 'cd dist && zip -r ../asterics-rest.zip *'
        sh 'npm pack'
      }
    }
    stage('Output') {
      parallel {
        stage('Store') {
          when {
            equals expected: true, actual: params.store
          }
          agent {
            label params.agent
          }
          steps {
            archiveArtifacts artifacts: 'asterics-rest*.zip', fingerprint: true
            // archiveArtifacts artifacts: 'dist/build.json', fingerprint: true
          }
        }
        stage('Release') {
          when {
            equals expected: true, actual: params.release
          }
          agent {
            docker {
              image params.image
              label params.agent
            }
          }
          environment {
            GIT_BRANCH = "$BRANCH"
          }
          steps {
            sh '''
              echo Release $BRANCH
            '''
          }
        }
      }
    }
  }
}