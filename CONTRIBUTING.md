# Guia de Contribución

Quero agradecerche o interés demostrado en, polo menos, acceder a esta páxina de informacion para contribuír con este proxecto, espero que poidas axudar a que medre.

## Por que contribuir

Todo software libre precisa de voluntariado que axude a manter vivo un proxecto, xa que unha soa persoa é moi dificil que manteña un aplicativo aínda cunha complexidade non moi alta xunto cá súa documentación actualizados a un ritmo acompasado.

Canto maior sexa o proxecto o número de persoas que precisa para soportalo medra de igual xeito e fai que sexa imperativo dividir as tarefas que son necesarias para facelo avanzar e corrixir os erros que vaian xurdindo, e así reducir o esforzo individual de cada persoa que esetea involucrada nel.

Por todo iso quero volver a agradecerche que esteas nesta sección.

Se probaches **ProxectOS** e ves que lle falta alugnha utilidade importante ou ves que ten erros que se debesen solucionar xa tes un motivo axudar. Non é preciso que teñas experiencia programando nin xestionando sistemas informáticos, chega con que sexas un usuario. Tes moitos xeitos de axudar á súa mellora.

## Cómo contribuir

### Usuarios e Usuarias

Se non eres unha persoa que se proveña do mundo da informática podes colaborar con desenvolvemento de **ProxectOS** dos seguintes xeitos:

* Notificando erros na súa execución
* Propoñendo funcionalidades que lle falten por implementar para adecuarse ó teu sector
* Propoñendo melloras na interface de usuario, por exemplo poñer máis accesible unha opción que estea moi escondida
* Propoñendo ampliar ou reducir ciclos de estados de algunha entidade (Equipos, Incidencias, Produtos...)
* Traducindo o proxecto
* Colaborando cá edición da documentación de emprego

### Programadores e Programadoras

Se tes experiencia programando podes contribuir:

* Facendo as melloras que consideres oportunas para darlle un valor engadido
* Resolvendo fallas de funcionamento e erros de deseño
* Mellorando a interface de usuario
* Mellorando ou engadindo informes
* Colaborando cá edición da documentación técnica

### Notificando unha incidencia

Se queres crear unha incidencia emprega un dos seguintes enlaces:
// TODO: xerar enlaces
| ENLACE                                    | FUNCIÓN
|:-                                         |:-
| [Erro no programa][ErroPrograma]          | Notificar un erro ó empregar o programa
| [Erro na documentación][ErroDoc]          | Notificar un erro na documentación
| [Nova funcionalidade][NovaFunionalidade]  | Propoñer unha nova funcionalidade para mellorar o alcance do programa
| [Mellora da interface][MelloraInterface]  | Propoñer un cambio na interface, ben para corrixir un erro ou ben para facela máis manexable
| [Nova incidencia][NovaIncidencia]         | Crear calquera outra incidencia

### Creando código

Se modificaches de algún dos xeitos anteriores o contido deste respositorio sería de agradecer que axudases a integrar esos cambios a **ProxectOS**. A maneria de facelo é a seguinte:

1. Fai un fork do repositorio
2. Fai os cambios que consideres oportunos pero intenta dividir as melloras en bloques de funcionalidade, é dicir, se vas a facer melloras na wiki sobre o emprego dunha característica e ademais vas a mellorar o modelo **Equipos** da BD faino en ramas separadas para poder integralos cambios por separado
3. Fai un `pull request` por cada mellor que queiras aportar
4. Cando estea feita unha análise das melloras, se se considera oportuno, incluirase no repositorio oficial

Se as túas propostas finalmente non se integran neste repositorio, por favor, non te desanimes e non abandones o proxecto, igual simplemente temos opinións distintas sobre o lugar cara onde debe ir **ProxectOS** e non quere dicir que a túa visión non estea ben, simplemente que non é a que se busca dende aquí, pero ti podes seguir evolucionando a túa idea e aproveitar este repositorio como base para facela medrar e alcanzar un público distinto. Seguro que moitas cousas que se fagan no teu proxecto as poderemos incorporar nun futuro e viceversa.

Tamén podes colaborar de calquera outro xeito que se che ocurra a ti e non estea aquí contemplado, agradecerase toda a axuda posible.

## Atribucións

Todas as incorporacións que se realicen ó proxecto serán incluídas no ficheiro [README].

## Código de conducta

Este proxecto ten un [Código de Conduta] ó cal desexo que tódalas persoas interesadas en colaborar se atiñan. 

[//]: # (Listado dos links empregados)

   [README]: <README.md>
   [Código de Conduta]: <CODE_OF_CONDUCT_GL.md>

   <!-- Issues -->

   [ErroPrograma]: <https://gitlab.iessanclemente.net/[url_proxecto]/issues/new?issuable_template=bug_software&issue[title]=Erro%20Programa>
   [ErroDoc]: <https://gitlab.iessanclemente.net/[url_proxecto]/issues/new?issuable_template=bug_doc&issue[title]=Erro%20Documentacion>

   [NovaFunionalidade]: <https://gitlab.iessanclemente.net/[url_proxecto]/issues/new?issuable_template=new_function&issue[title]=Nova%20Funcionaladiade>
   [MelloraInterface]: <https://gitlab.iessanclemente.net/[url_proxecto]/issues/new?issuable_template=frontend&issue[title]=Mellora%20da%20Interface>

   [NovaIncidencia]: <https://gitlab.iessanclemente.net/[url_proxecto]/issues/new?issuable_template=new_issue&issue[title]=Novo%20Incidencia>