
namespace Analytics.Models
{
    public class ChartData
    {

        /*
        var chartData = {
                    labels: ["Desktop", "Mobile", "Tablet"],
                    datasets: [
                        {
                            label: "Visits",
                            fillColor: "rgba(245,112, 32,0.5)",
                            strokeColor: "rgba(245, 112, 32, 1)",
                            data: [87736, 2880, 2057]
                        },
                        {
                            label: "Page Views",
                            fillColor: "rgba(245,112, 32,0.5)",
                            strokeColor: "rgba(245, 112, 32, 1)",
                            data: [236897, 5711, 5623]
                        }
                    ]
                };
        */

        /*
        var chartData = {
                    labels: ["Desktop", "Mobile", "Tablet"],
                    datasets: [
                        {
                            fillColor : "rgba(220,220,220,0.5)",
			                strokeColor : "rgba(220,220,220,1)",
			                pointColor : "rgba(220,220,220,1)",
			                pointStrokeColor : "#fff",
                            data: [87736, 2880, 2057]
                        },
                        {
                            fillColor : "rgba(220,220,220,0.5)",
			                strokeColor : "rgba(220,220,220,1)",
			                pointColor : "rgba(220,220,220,1)",
			                pointStrokeColor : "#fff",
                            data: [236897, 5711, 5623]
                        }
                    ]
                };
        */

        public string [] labels { get; set; }

        public dynamic[] datasets { get; set; }
    
    }

    public class ChartDataSet
    {
        public string label { get; set; }

        public string backgroundColor { get; set; }

        public string borderColor { get; set; }

        public string hoverBackgroundColor { get; set; }

        public string hoverBorderColor { get; set; }

        public object[] data { get; set; }
    }

    public class LineChartDataSet
    {
        public string label { get; set; }

        public string backgroundColor { get; set; }

        public string borderColor { get; set; }

        public string pointBackgroundColor { get; set; }

        public string pointBorderColor { get; set; }

        public string pointHoverBackgroundColor { get; set; }

        public string pointHoverBorderColor { get; set; }

        public object[] data { get; set; }
    }
}
