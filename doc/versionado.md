# ESTRATEXIA DE VERSIONADO

A continuación veras unha breve descrición da estratexía de ramificación e de etiquetaxe das versións operativas do software.

## Ramas

Decidín ramificar o proxecto do seguinte xeito:

| RAMA              | PROPÓSITO
|:-                 |:-
| master            | Versión de produción
| dev               | Rama principal de desenvolvemento do código
| test              | Desenvolvemnto do código para os Test da aplicación
| test_run          | Integración das ramas `dev` e `test` para executar os test

## Etiquetas

O modelo da etiquetas para o proxecto describirase na seguinte táboa:

| BLOQUE    | PROPÓSITO
|:-         |:-
| prefixo   | Indicará o tipo de estabilidade e madurez da compilación do módulo
| x         | Incrementos que incorporen un cambio no modelo de datos ou que supoñan cambios importantes. Pode supoñer que sexa preciso unha migración de datos ou que cambien as dependencias do módulo
| y         | Incrementos con novas funcionalidades estables. Pode supoñer unha actualización do módulo
| z         | Incrementos que solucionen erros (bugs)
| sufixo    | Indicará o módulo que está sendo versionado
Información sobre os `prefixos` e os `sufixos`:

| PREFIXOS  | PROPÓSITO
|:-         |:-
| a         | Versión en probas `alfa` aínda sen test completo
| b         | Versión en probas `beta` aínda sen test completo
| rc        | Versión na última fase de probas antes de ser promovida como versión en produción `release candidate`
| v         | Versión estable `release branch` para implementar en produción

| SUFIXOS   | PROPÓSITO
|:-         |:-
| db        | Indicará que o versionado corresponde ó módulo de `persistencia en Base de Datos`

Estas etiquetas serán idénticas á versión do package.json a excepción dos prefixos e sufixos que serán suprimidos.

## Exemplos

``` bash
a0.9.0-db
b0.9.3-db
rc0.9.5-db
v1.0.0-db
```
