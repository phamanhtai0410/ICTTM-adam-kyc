import React, { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

export function LineChartGraph ({ count }) {
  const chartRef = useRef(null)

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    const mainSuccessColor = '#14B550'
    const mutedSuccessColor = 'rgba(20, 181, 80, 0.2)'
    const mainErrorColor = '#EA1E1E'
    const mutedErrorColor = 'rgba(234, 30, 30, 0.2)'

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
          label: 'My First Dataset',
          data: count > 0 ? [10, 20, 30, 40, 50] : [50, 40, 30, 20, 10],
          fill: true,
          borderColor: count > 0 ? mainSuccessColor : mainErrorColor,
          tension: 0.1,
          borderWidth: 1,
          pointRadius: 0
        }]
      },
      options: {
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        elements: {
          line: {
            backgroundColor: count > 0 ? mutedSuccessColor : mutedErrorColor
          }
        }
      }
    })

    return () => {
      myChart.destroy()
    }
  }, [])

  return (
    <div>
      <canvas ref={chartRef} width='80' height='104' />
    </div>
  )
}
