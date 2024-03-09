Make sure you have a DockerRegistry running.
To create a Docker image use the "npm run docker" command.
To use the app in a Kybernetes Cluster use the "npm run k8s-deploy" command.
One way to access the app now is via the :"kubectl port-forward svc/jkpgnav-service 4000:3000 -n jkpgcity" command.
And then going to "http://localhost:4000" in the Webbrowser.
