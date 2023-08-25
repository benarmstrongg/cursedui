component(function counter($) {
    count = 0
    stepSize = 1;

    $('div', div => {
        with (div) {
            classList.add('lets-go', 'my-man')

            $('p', p => {
                with (p) {
                    innerText = `Count ${count}`

                    with (style) {
                        backgroundColor = 'red'
                        color = 'white'
                    }
                }
            });

            if (count === 69) {
                $('p', p => {
                    with (p) {
                        innerText = 'nice'
                    }
                });
            }

            $('button', button => {
                with (button) {
                    innerText = `+${stepSize}`
                    onclick = () => count += stepSize
                }
            });

            $('input', input => {
                with (input) {
                    type = 'number'
                    placeholder = 'Step size'
                    value = stepSize
                    onchange = (e) => stepSize = Number(e.target.value)

                    with (style) {
                        display = 'block'
                        marginTop = 10
                    }
                }

                with (div.style) {
                    if (stepSize === 420) {
                        backgroundColor = 'green'
                    }
                }
            });
        }
    });

    $('p', p => {
        with (p) {
            innerText = `Current count: ${count}; counting by ${stepSize}`;
        }
    });
});