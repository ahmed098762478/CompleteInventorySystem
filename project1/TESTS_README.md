# Tests du projet

Ce projet garde les tests qui apportent une vraie valeur sur le comportement metier, les endpoints et les requetes custom.

## Structure actuelle

```text
src/test/java/com/example/project1/
|- controller/
|  |- ProductControllerTests.java
|  `- UserControllerTest.java
|- service/
|  |- ProductServiceTests.java
|  `- UserServiceTest.java
|- ProductCRUDIntegrationTests.java
|- Project1ApplicationTests.java
`- UserCrudIntegrationTest.java
```

## Pourquoi certains tests ont ete supprimes

- `entity/ProductTests.java` : supprimé, car l'entite `Product` ne contient que des getters/setters sans logique metier.
- `repository/ProductRepositoryTests.java` : supprimé, car `ProductRepository` est un simple `JpaRepository` sans requete custom.

## Tests conserves

- `service/*` : prioritaires pour la logique applicative
- `controller/*` : utiles pour verifier les endpoints REST
- `ProductCRUDIntegrationTests` et `UserCrudIntegrationTest` : utiles pour couvrir le flux complet

## Ce qui n'est plus teste directement

- les entites simples sans logique metier
- les repositories CRUD standards
- le repository `UserRepository` et sa requete custom, par choix de simplification

## Execution

```bash
mvn test
```
