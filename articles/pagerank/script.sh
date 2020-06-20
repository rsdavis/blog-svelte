
for label in 0.15 0.5 0.85
do
	convert pr_${label}.png -pointsize 56 -draw "text 50,100 'd = ${label}'" pr_${label}_labeled.png
done

for label in 0.15 0.50 0.85
do
	convert pr_${label}_directed.png -pointsize 56 -draw "text 50,100 'd = ${label}'" pr_${label}_directed_labeled.png
done

montage pr_0.15_labeled.png pr_0.5_labeled.png pr_0.85_labeled.png -geometry +3+1 undirected.png
montage pr_0.15_directed_labeled.png pr_0.50_directed_labeled.png pr_0.85_directed_labeled.png -geometry +3+1 directed.png
