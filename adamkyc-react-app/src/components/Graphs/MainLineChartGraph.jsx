import React, { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

export function MainLineChartGraph () {
  const MainChartRef = useRef(null)

  useEffect(() => {
    const ctx = MainChartRef.current.getContext('2d')

    const mainColor = '#3498db'
    const mutedColor = 'rgba(52, 152, 219, 0.2)'

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: getMonthLabels(),
        datasets: [{
          label: 'Searches',
          data: generateRandomData(),
          fill: true,
          borderColor: mainColor,
          tension: 0.1,
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: mainColor
        }]
      },
      options: {
        scales: {
          x: {
            position: 'bottom',
            min: 0,
            max: 11,
            ticks: {
              stepSize: 1,
              callback: (value) => getMonthLabels()[value]
            }
          },
          y: {
            min: 0,
            max: 2000,
            ticks: {
              stepSize: 500
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const dataPoint = context.dataset.data[context.dataIndex]
                const date = getMonthLabels()[context.dataIndex]
                return `${date}: ${dataPoint} searches`
              }
            }
          }
        },
        elements: {
          line: {
            backgroundColor: mutedColor
          }
        }
      }
    })

    return () => {
      myChart.destroy()
    }
  }, [])

  return (
    <canvas
      ref={MainChartRef}
      width={1200}
      height={220}
    />
  )
}

function getMonthLabels () {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months
}

function generateRandomData () {
  return Array.from({ length: 12 }, () => Math.random() * 2000)
}
