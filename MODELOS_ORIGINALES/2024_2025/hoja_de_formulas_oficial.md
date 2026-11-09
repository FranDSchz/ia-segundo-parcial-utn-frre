**Reglas de asociación**

**$Soporte=\frac{\left({X\ U\ Y}\right).count}{n}$** 		$Confianza=\frac{\left({X\ U\ Y}\right).count}{X.count}$ 

**Árboles de decisión**

**$$Entropía\left({D}\right)=-\ \sum\limits_{j=1}^{|C|}P\left({{C}_{j}}\right)\ .\ {log}_{2}\left({P\left({{C}_{j}}\right)}\right)$$**

$${Entropía}_{{A}_{i}}\left({D}\right)=\sum\limits_{j=1}^{m}\frac{{|D}_{j}|}{|D|}\ .\ Entropía({D}_{j})$$

$Ganancia\left({D,\ {A}_{i}}\right)=Entropía\left({D}\right)-{Entropía}_{{A}_{i}}\left({D}\right)$ 

**$$TasaDeGanancia\left({D,\ {A}_{i}}\right)=\frac{Ganancia\left({D,\ {A}_{i}}\right)}{-\ \sum\limits_{j=1}^{m}(\frac{\left|{{D}_{j}}\right|}{\left|{D}\right|}\ .\ \ {log}_{2}(\frac{\left|{{D}_{j}}\right|}{\left|{D}\right|})}$$**

**Búsqueda**

A\*: f'(X) \= g(X) \+ h’(X)

**Algoritmos genéticos**

Selección por ruleta: ${Ranuras}_{i}={(aptitud}_{i}\ /\ \sum\limits_{i=1}^{N}{aptitud}_{i})\ .\ 100$

Selección con control de copias esperadas: ${c}_{i}={aptitud}_{i}\ /\ \overline{aptitud}$

Selección por ranking: ${c}_{i}={R}_{min}+2\ .\ \frac{\left({n-i}\right)\ .\ \ (1-{R}_{min})}{n-1}$

Mutación adaptativa: $Pm\left({t+1}\right)=Pm(t)±λ$		$Pmin≤Pm(t)≤Pmax$

**Naive Bayes**

**$$P\left({{a}_{1},…,\ {a}_{m}}\right)∝P\left({{c}_{i}}\right)\ .\ \prod\limits_{j=1}^{m}P\left({{c}_{i}}\right)$$**

$μ=\frac{1}{N}\ \sum\limits_{i=1}^{N}{x}_{i}$	$\sqrt{{\sigma }^{2}}=\sqrt{\frac{\sum\limits_{i=1}^{N}\ {({x}_{i}-\ μ)}^{2}}{N}}$	$P\left({{c}_{i}}\right)=\frac{1}{σ\ \sqrt{2π}}\ .\ {e}^{\frac{-\ {({a}_{j}-μ)}^{2}}{2\ .\ \ {\sigma }^{2}}}$

**Perceptrón**

**$$Net=\sum\limits_{i=0}^{N}{w}_{i}\ .\ {x}_{i}$$**

$${w}_{i}\left({t+1}\right)={w}_{i}\left({t}\right)+α.\left[{d\left({t}\right)-y\left({t}\right)}\right]\ .\ \ {x}_{i}$$

${w}_{1}\ .\ {x}_{1}+{w}_{2}\ .\ {x}_{2}=\ θ$		Método analítico

**MLP: Perceptrón multicapa**

**$${Net}_{pj}=\sum\limits_{i}^{}{w}_{ji}\ .\ \ {x}_{pi}$$**

Sigmoidal: ${y}_{pj}=\frac{1}{1+{e}^{-{Net}_{pj}}}$  			          ${f}_{j}^{'}\left({{Net}_{pj}}\right)={y}_{pj}\ \left({1-{y}_{pj}}\right)$

Tangente hiperbólica: ${y}_{pj}=\frac{{e}^{Net}-{e}^{-Net}}{{e}^{Net}+{e}^{-Net}}$	     	          ${f}_{j}^{'}\left({{Net}_{pj}}\right)=1-{y}_{pj}^{2}{\ }$

Sigmoidal: ${y}_{pj}=\frac{1}{1+{e}^{-2β{Net}_{pj}}}$  	     		          ${f}_{j}^{'}\left({{Net}_{pj}}\right)=2β\ .{y}_{j}\ .\ \left({1-{y}_{pj}}\right)$

Tangente hiperbólica: ${y}_{pj}=\frac{{e}^{βNet}-{e}^{-βNet}}{{e}^{βNet}+{e}^{-βNet}}$ 	          ${f}_{j}^{'}\left({{Net}_{pj}}\right)=β\left({1-{y}_{pj}^{2}\ }\right)$

Salida: ${\delta }_{pk}={f}_{k}^{'}\left({{Net}_{pk}}\right)\ .\ \left({{d}_{pk}-{y}_{pk}}\right)$		          Oculta: ${\delta }_{pj}={f}_{j}^{'}\left({{Net}_{pj}}\right)\ .\ \sum\limits_{k}^{}{(δ}_{pk}\ .\ {w}_{kj})$

$${w}_{kj}\left({t+1}\right)={w}_{kj}\left({t}\right)+α\ .\ {\delta }_{pk}\ .\ {y}_{pj}+β\left({{w}_{kj}\left({t}\right)-{w}_{kj}\left({t-1}\right)}\right)$$

$${E}_{p}=\frac{1}{2}\sum\limits_{k=1}^{M}{\left({{d}_{pk}-{y}_{pk}}\right)}^{2}\ \ \ \ \ \ \ \ \ \ \ \ {E}_{g}=\frac{1}{L}\ \sum\limits_{p=1}^{L}{E}_{p}$$

**SVM: Máquinas de vectores de soporte**

**$$Maximizar\ {L}_{D}=-\frac{1}{2}\sum\limits_{i,j=1}^{N}{y}_{i}.{y}_{j}.{\alpha }_{i}.{\alpha }_{j}.{\overline{x}}_{i}^{T}.{\overline{x}}_{j}$$**

$$Sujeto\ a:\ \sum\limits_{i=1}^{N}{y}_{i}.{\alpha }_{i}=0\ \ \ \ \ \ y\ \ \ \ \ {\alpha }_{i}≥0$$

$$\frac{\partial {L}_{p}}{\partial \overline{w}}=\overline{w}-\sum\limits_{i=1}^{N}{y}_{i}.{\alpha }_{i}.{\overline{x}}_{i}=0\ \ \ →\ \ \ \overline{w}=\sum\limits_{i=1}^{N}{y}_{i}.{\alpha }_{i}.{\overline{x}}_{i}$$

$$b=\frac{1}{{y}_{i}}-{\overline{w}}^{T}{\overline{x}}_{i}$$

Hiperplano de separación: Pendiente \= \- w1/w2	Ordenada al origen \= \-b/w2

Clasificar nuevas instancias: ${\overline{w}}^{T}{\overline{x}}_{i}+b\ \ \ \ \ >0→c=1\ \ \ \ \ <0→c=-1$

$$Margen={d}_{+}+{d}_{-}=\frac{2}{‖\overline{w}‖}=\frac{2}{\sqrt{{w}_{1}^{2}+{w}_{2}^{2}+...+{w}_{r}^{2}}}$$

**Hopfield**

**$$W=\sum\limits_{k=1}^{M}{(E}_{k}^{T}\ .\ \ {E}_{k}-I)$$**

S(t+1) \= S(t) . W 	siendo S(t=0) \= E

Recuperación perfecta: $#patrones≤\frac{N}{4\ .\ \ ln⁡(N)}$		Buena: $#patrones≤0,138N$

Ortogonalidad: $\sum\limits_{i=1}^{N}{\ e}_{i}^{(k)}\ .\ {e}_{i}^{(m)}\ ≤0\ \ \ \ ∀\ k≠m$

**SOM: Self Organizing Map**

**$$d=\sqrt{\sum\limits_{i=1}^{N}{\left({{w}_{ji}-{e}_{i}^{\left({k}\right)}}\right)}^{2}}$$**

${w}_{ji}\left({t+1}\right)={w}_{ji}\left({t}\right)\ +\ α\left({t}\right)\ .\ h\ .\ ({e}_{i}-{w}_{ji})$		$α=\frac{1}{t}$

**K-Means**

**$$dist\left({{\overline{x}}_{i},\ {\overline{m}}_{j}}\right)=\sqrt{{({x}_{i1}-{m}_{j1})}^{2}+...+{({x}_{ir}-{m}_{jr})}^{2}}$$**

$${\overline{m}}_{j}=\frac{1}{|{C}_{j}|}\ \sum\limits_{{\overline{x}}_{i}\ ∈\ {C}_{j}}^{}{\overline{x}}_{i}$$

**KNN: K Nearest Neighbors**

**$$f({x}_{q})←{argmax}_{c\ ∈\ C}\sum\limits_{i=1}^{K}\ \ \frac{\delta \left({c,\ f\left({{x}_{q}}\right)}\right)}{{d({x}_{q},\ {x}_{i})}^{2}}$$**