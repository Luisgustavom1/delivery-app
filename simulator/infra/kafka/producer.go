package kafka

import (
	"log"
	"os"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func NewKafkaProducer() *ckafka.Producer {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KafkaBootstrapServers"),
	}
	producer, err := ckafka.NewProducer(configMap)
	if err != nil {
		log.Println(err.Error())
	}
	return producer
}

func Publish(msg string, topic string, producer *ckafka.Producer) error {
	message := ckafka.Message{
		TopicPartition: ckafka.TopicPartition{Topic: &topic, Partition: ckafka.PartitionAny},
		Value:          []byte(msg),
	}

	return producer.Produce(&message, nil)
}
