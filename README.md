
# Frengee

Frengee é uma aplicação para gerenciamento de veículos construída com Node.js, Express, MongoDB e Kubernetes. Este repositório contém o código fonte da aplicação, juntamente com a configuração para Docker e Kubernetes.

## Pré-requisitos

- Node.js (v14 ou superior)
- Docker
- Docker Compose
- Minikube (para Kubernetes localmente)
- Kubernetes CLI (kubectl)
- GitHub CLI (gh)

## Instalação

### Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/frengee.git
cd frengee
```

## Uso

### Rodar a Aplicação Localmente com Docker Compose

1. Suba os contêineres com o Docker Compose:

```bash
docker-compose up --build
```

Este comando irá construir as imagens Docker e iniciar os contêineres para backend_1 e mongo_1.

2. Verifique se os contêineres estão rodando:

```bash
docker ps
```

3. Acesse a aplicação no navegador:

```plaintext
http://localhost:3017
```

### Construir e Empurrar Imagens Docker

1. Crie a imagem Docker:

```bash
docker build -t jayymeson/frengee-test-dev:1.1 .
```

2. Empurre a imagem Docker para o Docker Hub:

```bash
docker push jayymeson/frengee-test-dev:1.1
```

### Rodar a Aplicação no Kubernetes

1. Inicie o Minikube:

```bash
minikube start
```

2. Configure o Docker para usar o daemon do Minikube:

```bash
eval $(minikube docker-env)
```

3. Crie a imagem Docker e empurre para o Docker Hub (se ainda não fez):

```bash
docker build -t jayymeson/frengee-test-dev:1.1 .
docker push jayymeson/frengee-test-dev:1.1
```

4. Aplique as configurações do Kubernetes:

```bash
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/dev/ingress.yml
```

5. Verifique os pods e serviços:

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

6. Obtenha o IP do Minikube:

```bash
minikube ip
```

7. Adicione o IP ao arquivo `/etc/hosts`:

```plaintext
<IP_DO_MINIKUBE>  frengee-test.com
```

8. Acesse a aplicação no navegador:

```plaintext
http://frengee-test.com/ci-cd
```

## Testes

### Executar Testes Unitários

```bash
npm test
```

## CI/CD

O repositório está configurado para CI/CD com GitHub Actions. O workflow está definido em `.github/workflows/vehicle.yml`.

### Configuração dos Segredos

Certifique-se de adicionar os seguintes segredos no GitHub:

- `DOCKER_HUB_USER`: Seu nome de usuário do Docker Hub.
- `DOCKER_HUB_PWD`: Sua senha do Docker Hub.
- `K8S_CONFIG`: Configuração do kubeconfig para acessar o cluster Kubernetes.

## Autenticação

Para utilizar a API, primeiro precisamos nos autenticar para obter um token de acesso.

### Exemplo de Autenticação

Endpoint: `POST /auth/login`

**Request:**

```json
{
  "email": "frengee@mail.com",
  "password": "Abcd1234*"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

![Autenticação](![alt text](image.png))

## Exemplos de Uso

### Criação de um Veículo

Após obter o token, use-o no Bearer Token para criar um veículo.

Endpoint: `POST /api/vehicles`

**Request (multipart-form):**

- make: Volks
- model: Gol
- year: 2020
- imageUrl: [arquivo de imagem]

**Response:**

```json
{
  "make": "Volks",
  "model": "Gol",
  "year": 2020,
  "imageUrl": "https://storage.googleapis.com/frengee-3bfe2.appspot.com/carbon.png",
  "_id": "66ab9903d4896af48b1535f"
}
```

![Criação de Veículo](![alt text](image-1.png))

### Atualização de um Veículo

Para atualizar um veículo, também precisamos passar o Bearer Token.

Endpoint: `PUT /api/vehicles/{id}`

**Request (multipart-form):**

- make: Jeep
- model: Compass
- year: 2022
- imageUrl: [arquivo de imagem]

**Response:**

Status 204 No Content

![Atualização de Veículo](![alt text](image-2.png))

## Contribuição

1. Fork o repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`).
3. Commit suas mudanças (`git commit -am 'Adicionar nova feature'`).
4. Push para a branch (`git push origin feature/nome-da-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.