---
date: '2019-06-01'
image: 'pie-binary.png'
---

# D3 Bivariate Pie Chart

Here is an interesting approach to representing bivariate data using a twist on the standard pie chart.
I use D3 to draw a point for each datum according to its membership in two categorical variables.
One variable sets the sector while the other decides the hue.
Its a unique way of communicating highly skewed distributions at a glance.
A few tricks are employed to achieve a good particle packing, and the chart is tested on data from the Titanic.

## Preprocessing

Data is fed into the plot as an array of javascript objects with the category and the hue.
Each object in the array represent a point.
The category is used to determine into which slice of the pie the point will fall, while the hue is used to set the point class so that it can be colored/styled using css.

```json
[
    {
        category: 'A',
        hue: 0
    },
    {
        category: 'B',
        hue: 1
    }
]
```

I do some preprocessing to figure out some aspect of the placement, such as the percentage of points in each category.
Then, this can be used to produce the `start` and `end` angles for each sector of the pie, being sure to leave room for gaps.
The inner and outer radii are set by the user, as well as the radius of the points.

<iframe src='https://irate-vegetable.surge.sh/' scrolling="no" frameBorder="0" width='650' height='650'></iframe>

## Particle Placement

There are many ways to go about placing the particles.
If you just randomly choose `x` and `y`, or `r` and `theta`, then you will end up will lots of overlapping point.
This may be fine, but it does not have the same visual appeal as nicely packed particles.
In addition, you will likely end up will more particles towards the center of the circle, depending on how they are placed.

There are a few tricks that can be used to get a nice particle packing.
I give brief outlines of these approaches below.

### 1) Polar Coordinates

Its easiest to use polar coordinates and a random number generator to randomly place particles. However, due to the fact that the area of a circle increases with the square of its radius, you will not get uniform particle placement. This can be accounted for by transforming the uniform probability distribution such that it favors larger `r`. For an annulus, the math works out to be as given below, where $x$ is randomly distributed from [0,1]. Maybe I will write a follow up article explaining the math behind this ... stay tuned!
$$
r = \sqrt{ x (r_1^2 - r_0^2) + r_0^2 }
$$

```
place (t0, t1) {
    let r0 = this.inner
    let r1 = this.outer
    let rr = d3.randomUniform(0, 1)()
    let pr = Math.sqrt(rr*(r1*r1-r0*r0) + r0*r0)
    let theta =  d3.randomUniform(t0, t1)()
    let x = 1 + pr * Math.cos(theta)
    let y = 1 + pr * Math.sin(theta)
    return { x, y }
}
```

### 2) Replacement

Even after accounting for probability distribution, you will still end up will points falling on top of each other. For this, its sometimes better to use a replacement strategy. Make a placement attempt and if the centers of two points are within a single radius of each other, then try placing the particle again. Careful with this strategy, as it can quickly become computationally expensive $O(N^2)$ and will delay the initial load. Make sure to limit the number of replacement attempts.

### 3) Soft-body Forces

At this part of the process, the points should be drawn on screen. However, some of them will still be overlapping around the edges, while large gaps of space are still available. I use an simple iterative integration scheme to move the particles away from each other. For this, a soft, pairwise potential will *gently* push particles into open spaces. You need to be careful with the timestep and boundary conditions to make sure things remain stable. Below are the equations of force between particles $i$ and $j$, where $r_c$ is a cutoff. I found that setting $r_c$ to be 3 times the circle radius. Set $a$ to a small number, this will depend on the units of $r$.
$$
F_{ij} = \begin{cases}
 a(1 - r_{ij}/r_c), \quad &r_{ij}< r_c \\
 0, \quad &r_{ij}\ge r_c
 \end{cases}
$$

Again, these calculations can quickly become expensive.
I have tested that it runs in real time on a small laptop up to a thousand datapoints.
Mobile may be a different story!

```
for (let i=0; i<data.length; i++) {
    fx[i] = 0
    fy[i] = 0
}

for (let i=0; i<data.length; i++) {
    for (let j=i+1; j<data.length; j++) {

        let rx = data[i].x - data[j].x
        let ry = data[i].y - data[j].y
        let rr = Math.sqrt(rx*rx + ry*ry)

        if (rr < rc) {
            let ff = aij*(1 - rr/rc)
            let ffx = ff*rx/rr
            let ffy = ff*ry/rr
            fx[i] += ffx
            fy[i] += ffy
            fx[j] -= ffx
            fy[j] -= ffy
        }
    }
}
```

In the examples shown, I use all three of the outlined strategies. The placement and replacement strategies allow the chart to display quickly, while the iterative updates continue to improve particle packing while the user views the chart. It also creates a nice animation using D3 transitions. Be sure that the transition durations match the iteration updates for a smooth animation.

## Titanic

For a quick example of how this sort of chart might be used to represent real data, I use the titanic dataset to display the distribution in survival rates across social classes.
Each point in the pie chart represents a person aboard the titanic for which we have data on the quality of their cabin and whether they survived the disaster.
The social categories are Upper, Middle, and Lower; these make up the three pieces of the pie. Whether the person survived (open circle) or perished (closed circle) is represented by the circle styling. Its easy to see at a glance the disparity in survival rates across classes, with the lower class suffering the worst fate.

<iframe src='https://symptomatic-journey.surge.sh/' scrolling="no" frameBorder="0" width='650' height='650'></iframe>

Try refreshing the page to see the points as they are being animated.