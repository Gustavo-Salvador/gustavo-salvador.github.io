
# Map Draw

O Map Draw é uma ferramenta simples para desenho em mapas, ele utiliza o Google Maps Javascrip API como base para visualização e desenho em mapas. 
Inicialmente o Map Draw foi criado como projeto prático para uma avaliação de uma vaga de emprego.

## Atuais Funcionalidades (tutorial)

### Layout
![Imagem destacando as areas do layout principal do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/layout.png?raw=true "layout principal")

### barra de ferramentas
![Imagem destacando a barra de ferramentas do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas.png?raw=true "barra de ferramentas")

No lado esquerdo do site se enconta a barra de ferramentas.

1. Mover mapa

![Imagem destacando a ferramenta de mover mapa do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_mover_mapa.png?raw=true "ferramenta mover mouse")

Ferramenta que permite mover o mapa clicando e arrastando o mouse, isso também é possivel com as outras ferramentas, todavia outras ferramentas ao clicar geram / editam / apagam formas assim podendo causar problemas em caso de clicar erroneamente no mouse.

2. Mover forma 

![Imagem destacando a ferramenta de mover forma do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_mover_forma.png?raw=true "ferramenta mover forma")

Ferramenta que permite mover formas clicando e arrastando elas, para tal primeiro o usuário deve clicar na forma que deseja arrastar, assim a espessura de sua linha irá aumentar, indicando que a forma já pode ser movida, clicar em outra forma muda a forma que está sendo reposicionada no momendo e clicar no mapa desabilita o movimento da forma selecionada.

3. Editar forma  

![Imagem destacando a ferramenta de editar forma do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_editar_forma.png?raw=true "ferramenta editar forma")

Ao clicar em uma forma com essa ferramenta selecionada é habilitado o modo de edição para esta ferramenta.   
Ao entrar em modo de edição é possivel fazer as seguintes alerações à forma:

- mudar suas cores (linha, preenchimento, cores do marcador conforme [documentado aqui](#cores do marcador) etc);
- mudar parâmetros da forma (espessura da linha, opacidade, etc.)
- mudar a posição da forma;
- mudar o tamanho da forma;
- em caso de polígonos e linhas:
    - alterar a posição de cada ponto;
    - adicionar novos pontos;
    - remover pontos (clicando com o botão direito em um ponto).

4. Desenhar polígono

![Imagem destacando a ferramenta de desenhar polígono do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_desenhar_poligono.png?raw=true "ferramenta desenhar polígono")

Ferramenta para desenhar polígonos.  
Para iniciar um polígono o usuário deve clicar na tela, os próximo n cliques definirão os vértices do polígono, para finalizar o polígono o usuário deve clicar 2 vezes.

5. Desenhar círculo

![Imagem destacando a ferramenta de desenhar círculo do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_desenhar_circulo.png?raw=true "ferramenta desenhar círculo")

Ferramenta para desenhar círculos.  
O primeiro clique define o centro do círculo e o segundo clique define o raio, baseado na distância entre a posição do segundo clique e o centro do círculo.

6. Desenhar retângulo 

![Imagem destacando a ferramenta de desenhar retângulo do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_desenhar_retangulo.png?raw=true "ferramenta desenhar retângulo")

Ferramenta para desenhar retângulos.  
O primeiro clique define um dos cantos do retângulo e o segundo define o outro canto, o canto a ser definido depende da direção seguida pelo mouse em relação ao ponto inicial.

7. desenhar linha

![Imagem destacando a ferramenta de desenhar linha do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_desenhar_linha.png?raw=true "ferramenta desenhar linha")

Ferramenta para desenhar linha.  
O primeiro clique define o ponto inicial da linha e o segundo clique define o ponto final da linal.

8. desenhar polilinha

![Imagem destacando a ferramenta de desenhar Polilinha do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_desenhar_poli_linha.png?raw=true "ferramenta desenhar Polilinha")

Ferramenta para desenhar polilinha.  
Funcionalidade parecida com a do poligono, todavia não possui preenchimento e ao finalizar ela não é fechada automaticamente (não adiciona uma linha ligando o último ponto adicionado ao primeiro ponto).  
Para iniciar uma polilinha o usuário deve clicar na tela, os próximo n cliques definirão os vértices da polílinha, para finalizar a polílinha o usuário deve clicar 2 vezes.  

9. colocar marcador

![Imagem destacando a ferramenta de colocar marcador do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_desenhar_marcador.png?raw=true "ferramenta colocar marcador")

Ferramenta para colocar marcador.  
Para colocar um marcador basta clicar no local onde deseja adicionar.  
Ao selecionar a ferramenta colocar marcador a barra de opção é altrada para a opção de marcador, para saber o que cada cor significa basta se basear nesta imagem: 

![Imagem mostrando as partes de um marcador](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/marcador.png?raw=true "partes de um marcador")

marcador sem glifo:

![Imagem destacando a ferramenta de colocar marcador do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/marcador_sem_glifo.png?raw=true "ferramenta colocar marcador")

10. apagar forma

![Imagem destacando a ferramenta de apagar forma do aplicativo](https://github.com/Gustavo-Salvador/gustavo-salvador.github.io/blob/main/mapDraw/help/imagens/barra_de_ferramentas_apagar_forma.png?raw=true "ferramenta apagar forma")

Ferramenta que permite apagar formas.  
Para apagar uma forma basta vlicar sobre ela.  

Obs: A opção seguir geometria esférica permite ao poligono, linha e polilinha ser afetador pelo formato da Terra.

## Autor

- [@Luiz Gustavo Fernandes Salvador](https://github.com/Gustavo-Salvador)